from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import requests
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============= MODELS =============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    country: Optional[str] = None
    favorite_themes: List[str] = []
    points: int = 0
    level: int = 1
    streak_days: int = 0
    last_login_date: Optional[str] = None
    created_at: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdateProfile(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    favorite_themes: Optional[List[str]] = None
    picture: Optional[str] = None

class Theme(BaseModel):
    model_config = ConfigDict(extra="ignore")
    theme_id: str
    name: str
    icon: str
    description: str
    color: str
    popular: bool = False

class QuizQuestion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    question_id: str
    theme_id: str
    question_text: str
    question_type: str  # "mcq", "true_false"
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty: int  # 1-3

class QuizSubmission(BaseModel):
    theme_id: str
    answers: List[str]  # List of user answers
    time_taken: int  # seconds

class QuizResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    result_id: str
    user_id: str
    theme_id: str
    score: int
    total_questions: int
    points_earned: int
    time_taken: int
    date: str
    perfect_score: bool

class FunFact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    fact_id: str
    theme_id: str
    title: str
    content: str
    source: Optional[str] = None
    points: int = 2

class Badge(BaseModel):
    model_config = ConfigDict(extra="ignore")
    badge_id: str
    name: str
    description: str
    icon: str
    requirement: str

class UserBadge(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    badge_id: str
    unlocked_at: str

class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    name: str
    picture: Optional[str] = None
    country: str
    points: int
    rank: int

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    notif_id: str
    user_id: str
    type: str
    message: str
    read: bool = False
    created_at: str

class SessionExchangeRequest(BaseModel):
    session_id: str

# ============= AUTH HELPERS =============

async def get_current_user(request: Request) -> Optional[dict]:
    """Extract user from session_token (cookie or Authorization header)"""
    session_token = None
    
    # Try cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session in database
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_doc

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def update_streak(user_id: str):
    """Update user's daily streak"""
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    if not user:
        return
    
    today = datetime.now(timezone.utc).date().isoformat()
    last_login = user.get("last_login_date")
    
    if last_login != today:
        # Check if yesterday
        yesterday = (datetime.now(timezone.utc).date() - timedelta(days=1)).isoformat()
        if last_login == yesterday:
            # Continue streak
            new_streak = user.get("streak_days", 0) + 1
        else:
            # Reset streak
            new_streak = 1
        
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"streak_days": new_streak, "last_login_date": today}}
        )
        
        # Award streak point
        await db.users.update_one(
            {"user_id": user_id},
            {"$inc": {"points": 1}}
        )

async def check_and_award_badges(user_id: str):
    """Check and award badges based on user achievements"""
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    if not user:
        return
    
    # Get already unlocked badges
    unlocked = await db.user_badges.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    unlocked_badge_ids = [b["badge_id"] for b in unlocked]
    
    # Check each badge condition
    badges_to_award = []
    
    # 7 days streak
    if user.get("streak_days", 0) >= 7 and "badge_streak_7" not in unlocked_badge_ids:
        badges_to_award.append("badge_streak_7")
    
    # Perfect score
    perfect_results = await db.user_quiz_results.count_documents({
        "user_id": user_id,
        "perfect_score": True
    })
    if perfect_results >= 1 and "badge_perfect_score" not in unlocked_badge_ids:
        badges_to_award.append("badge_perfect_score")
    
    # 10 quizzes played
    total_quizzes = await db.user_quiz_results.count_documents({"user_id": user_id})
    if total_quizzes >= 10 and "badge_10_quizzes" not in unlocked_badge_ids:
        badges_to_award.append("badge_10_quizzes")
    
    # Award new badges
    for badge_id in badges_to_award:
        await db.user_badges.insert_one({
            "user_id": user_id,
            "badge_id": badge_id,
            "unlocked_at": datetime.now(timezone.utc).isoformat()
        })

# ============= AUTH ROUTES =============

@api_router.post("/auth/register")
async def register(data: UserRegister, response: Response):
    """Email/Password registration"""
    # Check if user exists
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_pw = hash_password(data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": data.email,
        "password": hashed_pw,
        "name": f"{data.first_name} {data.last_name}",
        "picture": None,
        "country": None,
        "favorite_themes": [],
        "points": 0,
        "level": 1,
        "streak_days": 0,
        "last_login_date": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Set httpOnly cookie for session (dev-friendly: secure=False for localhost)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7*24*60*60,
        path="/"
    )
    
    # Return user without password
    user_doc.pop("password", None)
    user_doc.pop("_id", None)
    
    return {"user": user_doc, "session_token": session_token}

@api_router.post("/auth/login")
async def login(data: UserLogin, response: Response):
    """Email/Password login"""
    user_doc = await db.users.find_one({"email": data.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(data.password, user_doc.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_doc["user_id"],
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Set httpOnly cookie for session (dev-friendly: secure=False for localhost)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7*24*60*60,
        path="/"
    )
    
    # Update streak
    await update_streak(user_doc["user_id"])
    
    # Return user without password
    user_doc.pop("password", None)
    user_doc.pop("_id", None)
    
    return {"user": user_doc, "session_token": session_token}

@api_router.post("/auth/session")
async def exchange_session(data: SessionExchangeRequest, response: Response):
    """Exchange session_id from OAuth for session_token"""
    try:
        # Call Emergent Auth API
        headers = {"X-Session-ID": data.session_id}
        resp = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers=headers,
            timeout=10
        )
        
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session_id")
        
        oauth_data = resp.json()
        
        # Check if user exists
        user_doc = await db.users.find_one({"email": oauth_data["email"]})
        
        if user_doc:
            # Update existing user
            await db.users.update_one(
                {"email": oauth_data["email"]},
                {"$set": {
                    "name": oauth_data["name"],
                    "picture": oauth_data["picture"]
                }}
            )
            user_id = user_doc["user_id"]
        else:
            # Create new user
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            user_doc = {
                "user_id": user_id,
                "email": oauth_data["email"],
                "name": oauth_data["name"],
                "picture": oauth_data["picture"],
                "country": None,
                "favorite_themes": [],
                "points": 0,
                "level": 1,
                "streak_days": 0,
                "last_login_date": None,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(user_doc)
        
        # Create session with OAuth session_token
        session_token = oauth_data["session_token"]
        session_doc = {
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.user_sessions.insert_one(session_doc)
        
        # Update streak
        await update_streak(user_id)
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7*24*60*60,
            path="/"
        )
        
        # Get fresh user data
        user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password": 0})
        
        return {"user": user_doc, "session_token": session_token}
    
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"OAuth service error: {str(e)}")

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user from session"""
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout and delete session"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
        response.delete_cookie("session_token", path="/")
    
    return {"message": "Logged out"}

# ============= USER ROUTES =============

@api_router.get("/user/profile")
async def get_profile(request: Request):
    """Get user profile"""
    user = await get_current_user(request)
    
    # Get additional stats
    total_quizzes = await db.user_quiz_results.count_documents({"user_id": user["user_id"]})
    
    results = await db.user_quiz_results.find({"user_id": user["user_id"]}, {"_id": 0}).to_list(1000)
    correct_answers = sum(r["score"] for r in results)
    total_answers = sum(r["total_questions"] for r in results)
    success_rate = round((correct_answers / total_answers * 100) if total_answers > 0 else 0, 1)
    
    # Get rank
    all_users = await db.users.find({}, {"_id": 0, "user_id": 1, "points": 1}).to_list(10000)
    sorted_users = sorted(all_users, key=lambda x: x["points"], reverse=True)
    rank = next((i+1 for i, u in enumerate(sorted_users) if u["user_id"] == user["user_id"]), 0)
    
    return {
        **user,
        "stats": {
            "total_quizzes": total_quizzes,
            "success_rate": success_rate,
            "rank": rank
        }
    }

@api_router.put("/user/profile")
async def update_profile(data: UserUpdateProfile, request: Request):
    """Update user profile"""
    user = await get_current_user(request)
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    
    if update_data:
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": update_data}
        )
    
    # Return updated user
    updated_user = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0, "password": 0})
    return updated_user

@api_router.get("/user/badges")
async def get_user_badges(request: Request):
    """Get user's unlocked badges"""
    user = await get_current_user(request)
    
    # Get all badges
    all_badges = await db.badges.find({}, {"_id": 0}).to_list(100)
    
    # Get unlocked badges
    unlocked = await db.user_badges.find({"user_id": user["user_id"]}, {"_id": 0}).to_list(100)
    unlocked_ids = [b["badge_id"] for b in unlocked]
    
    # Mark badges as unlocked
    for badge in all_badges:
        badge["unlocked"] = badge["badge_id"] in unlocked_ids
        badge["unlocked_at"] = next(
            (b["unlocked_at"] for b in unlocked if b["badge_id"] == badge["badge_id"]),
            None
        )
    
    return all_badges

@api_router.get("/user/history")
async def get_user_history(request: Request):
    """Get user's quiz history"""
    user = await get_current_user(request)
    
    results = await db.user_quiz_results.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("date", -1).limit(50).to_list(50)
    
    # Enrich with theme names
    for result in results:
        theme = await db.quiz_themes.find_one({"theme_id": result["theme_id"]}, {"_id": 0})
        result["theme_name"] = theme["name"] if theme else "Unknown"
    
    return results

# ============= QUIZ ROUTES =============

@api_router.get("/themes")
async def get_themes():
    """Get all quiz themes"""
    themes = await db.quiz_themes.find({}, {"_id": 0}).to_list(100)
    return themes

@api_router.get("/themes/{theme_id}/quiz")
async def get_theme_quiz(theme_id: str, request: Request):
    """Get random 10 questions from a theme"""
    user = await get_current_user(request)
    
    # Get all questions for theme
    questions = await db.quiz_questions.find(
        {"theme_id": theme_id},
        {"_id": 0}
    ).to_list(1000)
    
    if len(questions) < 10:
        raise HTTPException(status_code=404, detail="Not enough questions for this theme")
    
    # Randomly select 10
    selected = random.sample(questions, 10)
    
    # Remove correct answers before sending to client
    for q in selected:
        q["correct_answer_hidden"] = True
        q.pop("correct_answer", None)
        q.pop("explanation", None)
    
    return selected

@api_router.post("/quiz/submit")
async def submit_quiz(data: QuizSubmission, request: Request):
    """Submit quiz answers and calculate score"""
    user = await get_current_user(request)
    
    # Get questions
    questions = await db.quiz_questions.find(
        {"theme_id": data.theme_id},
        {"_id": 0}
    ).to_list(1000)
    
    if len(questions) < len(data.answers):
        raise HTTPException(status_code=400, detail="Invalid quiz submission")
    
    # Calculate score (for simplicity, use first N questions)
    score = 0
    results_detail = []
    
    for i, answer in enumerate(data.answers):
        if i < len(questions):
            correct = questions[i]["correct_answer"]
            is_correct = answer == correct
            if is_correct:
                score += 1
            
            results_detail.append({
                "question": questions[i]["question_text"],
                "user_answer": answer,
                "correct_answer": correct,
                "is_correct": is_correct,
                "explanation": questions[i]["explanation"]
            })
    
    # Calculate points
    points_earned = score  # 1 point per correct answer
    perfect_score = score == len(data.answers)
    
    if perfect_score:
        points_earned += 10  # Bonus for perfect score
    
    # Speed bonus (if under 60 seconds total)
    if data.time_taken < 60:
        points_earned += 5
    
    # Save result
    result_id = f"result_{uuid.uuid4().hex[:12]}"
    result_doc = {
        "result_id": result_id,
        "user_id": user["user_id"],
        "theme_id": data.theme_id,
        "score": score,
        "total_questions": len(data.answers),
        "points_earned": points_earned,
        "time_taken": data.time_taken,
        "date": datetime.now(timezone.utc).isoformat(),
        "perfect_score": perfect_score
    }
    await db.user_quiz_results.insert_one(result_doc)
    
    # Update user points and level
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$inc": {"points": points_earned}}
    )
    
    # Update level based on total points
    updated_user = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    new_level = calculate_level(updated_user["points"])
    
    if new_level != updated_user.get("level", 1):
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"level": new_level}}
        )
    
    # Check and award badges
    await check_and_award_badges(user["user_id"])
    
    return {
        "score": score,
        "total_questions": len(data.answers),
        "points_earned": points_earned,
        "perfect_score": perfect_score,
        "new_level": new_level,
        "results_detail": results_detail
    }

def calculate_level(points: int) -> int:
    """Calculate level based on points"""
    if points < 100:
        return 1
    elif points < 500:
        return 2
    elif points < 1000:
        return 3
    elif points < 3000:
        return 4
    elif points < 10000:
        return 5
    else:
        return 6

@api_router.get("/quiz/daily")
async def get_daily_quiz(request: Request):
    """Get today's featured quiz theme"""
    user = await get_current_user(request)
    
    # For demo, rotate through themes by day of week
    day_of_week = datetime.now(timezone.utc).weekday()
    themes = await db.quiz_themes.find({}, {"_id": 0}).to_list(100)
    
    if themes:
        daily_theme = themes[day_of_week % len(themes)]
        return daily_theme
    
    return {}

# ============= FUN FACTS ROUTES =============

@api_router.get("/fun-facts/daily")
async def get_daily_fun_fact(request: Request):
    """Get today's fun fact"""
    user = await get_current_user(request)
    
    # For demo, rotate through facts by day
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    facts = await db.fun_facts.find({}, {"_id": 0}).to_list(1000)
    
    if facts:
        daily_fact = facts[day_of_year % len(facts)]
        
        # Check if already read
        read_fact = await db.user_read_facts.find_one({
            "user_id": user["user_id"],
            "fact_id": daily_fact["fact_id"]
        })
        
        daily_fact["already_read"] = read_fact is not None
        return daily_fact
    
    return {}

@api_router.post("/fun-facts/{fact_id}/read")
async def mark_fact_read(fact_id: str, request: Request):
    """Mark fun fact as read and award points"""
    user = await get_current_user(request)
    
    # Check if already read
    existing = await db.user_read_facts.find_one({
        "user_id": user["user_id"],
        "fact_id": fact_id
    })
    
    if existing:
        return {"message": "Already read", "points_earned": 0}
    
    # Mark as read
    await db.user_read_facts.insert_one({
        "user_id": user["user_id"],
        "fact_id": fact_id,
        "read_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Award points
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$inc": {"points": 2}}
    )
    
    return {"message": "Points awarded", "points_earned": 2}

# ============= LEADERBOARD ROUTES =============

@api_router.get("/leaderboard/global")
async def get_global_leaderboard(request: Request):
    """Get global leaderboard"""
    user = await get_current_user(request)
    
    # Get top 100 users by points
    users = await db.users.find(
        {},
        {"_id": 0, "user_id": 1, "name": 1, "picture": 1, "country": 1, "points": 1}
    ).sort("points", -1).limit(100).to_list(100)
    
    # Add rank
    for i, u in enumerate(users):
        u["rank"] = i + 1
    
    # Find current user rank
    user_entry = next((u for u in users if u["user_id"] == user["user_id"]), None)
    
    return {
        "leaderboard": users[:50],
        "user_rank": user_entry["rank"] if user_entry else 0,
        "user_points": user["points"]
    }

@api_router.get("/leaderboard/country/{country}")
async def get_country_leaderboard(country: str, request: Request):
    """Get country-specific leaderboard"""
    user = await get_current_user(request)
    
    # Get users from country
    users = await db.users.find(
        {"country": country},
        {"_id": 0, "user_id": 1, "name": 1, "picture": 1, "country": 1, "points": 1}
    ).sort("points", -1).limit(100).to_list(100)
    
    # Add rank
    for i, u in enumerate(users):
        u["rank"] = i + 1
    
    user_entry = next((u for u in users if u["user_id"] == user["user_id"]), None)
    
    return {
        "leaderboard": users,
        "user_rank": user_entry["rank"] if user_entry else 0
    }

# ============= NOTIFICATIONS ROUTES =============

@api_router.get("/notifications")
async def get_notifications(request: Request):
    """Get user notifications"""
    user = await get_current_user(request)
    
    notifs = await db.notifications.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    return notifs

@api_router.put("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, request: Request):
    """Mark notification as read"""
    user = await get_current_user(request)
    
    await db.notifications.update_one(
        {"notif_id": notif_id, "user_id": user["user_id"]},
        {"$set": {"read": True}}
    )
    
    return {"message": "Marked as read"}

# ============= FEEDBACK ROUTES =============

class FeedbackSubmission(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    liked_features: List[str]
    missing_features: Optional[str] = None
    would_recommend: str  # "yes", "maybe", "no"

@api_router.post("/feedback")
async def submit_feedback(data: FeedbackSubmission, request: Request):
    """Submit user feedback"""
    user = await get_current_user(request)
    
    feedback_doc = {
        "feedback_id": f"feedback_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "rating": data.rating,
        "liked_features": data.liked_features,
        "missing_features": data.missing_features,
        "would_recommend": data.would_recommend,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    await db.feedbacks.insert_one(feedback_doc)
    
    # Marquer que l'utilisateur a soumis son feedback
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"feedback_submitted": True}}
    )
    
    # Bonus de points
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$inc": {"points": 5}}
    )
    
    return {"message": "Feedback submitted", "points_earned": 5}

# ============= PREMIUM & PARTNERSHIPS ROUTES =============

class PremiumWaitlist(BaseModel):
    email: EmailStr

@api_router.post("/premium/waitlist")
async def join_premium_waitlist(data: PremiumWaitlist, request: Request):
    """Join premium waitlist"""
    user = await get_current_user(request)
    
    waitlist_doc = {
        "waitlist_id": f"waitlist_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "email": data.email,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    await db.premium_waitlist.insert_one(waitlist_doc)
    
    return {"message": "Added to waitlist"}

class PartnerRequest(BaseModel):
    company_name: str
    sector: str
    email: EmailStr
    phone: Optional[str] = None
    estimated_budget: Optional[str] = None
    message: Optional[str] = None

@api_router.post("/partners/request")
async def submit_partner_request(data: PartnerRequest, request: Request):
    """Submit partnership request"""
    user = await get_current_user(request)
    
    partner_doc = {
        "request_id": f"partner_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "company_name": data.company_name,
        "sector": data.sector,
        "email": data.email,
        "phone": data.phone,
        "estimated_budget": data.estimated_budget,
        "message": data.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    await db.partner_requests.insert_one(partner_doc)
    
    return {"message": "Partnership request submitted"}

class EnterpriseLead(BaseModel):
    name: str
    company: str
    team_size: str  # "1-10", "11-50", "51-200", "200+"
    email: EmailStr
    phone: Optional[str] = None
    needs: Optional[str] = None

@api_router.post("/enterprise/lead")
async def submit_enterprise_lead(data: EnterpriseLead, request: Request):
    """Submit enterprise lead"""
    user = await get_current_user(request)
    
    lead_doc = {
        "lead_id": f"enterprise_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "name": data.name,
        "company": data.company,
        "team_size": data.team_size,
        "email": data.email,
        "phone": data.phone,
        "needs": data.needs,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    await db.enterprise_leads.insert_one(lead_doc)
    
    return {"message": "Enterprise lead submitted"}

class AmbassadorApplication(BaseModel):
    first_name: str
    university: str
    city: str
    email: EmailStr
    motivation: str

@api_router.post("/ambassadors/apply")
async def apply_ambassador(data: AmbassadorApplication, request: Request):
    """Apply for campus ambassador program"""
    user = await get_current_user(request)
    
    application_doc = {
        "application_id": f"ambassador_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "first_name": data.first_name,
        "university": data.university,
        "city": data.city,
        "email": data.email,
        "motivation": data.motivation,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "pending"
    }
    
    await db.ambassadors.insert_one(application_doc)
    
    return {"message": "Application submitted"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

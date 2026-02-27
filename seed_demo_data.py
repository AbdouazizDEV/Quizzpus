#!/usr/bin/env python3
"""
Demo data seeder for Quizz+ MongoDB database
"""

from pymongo import MongoClient
import uuid
from datetime import datetime, timezone

def generate_id():
    return uuid.uuid4().hex[:12]

def seed_database():
    # Connect to MongoDB
    client = MongoClient("mongodb://localhost:27017")
    db = client["test_database"]
    
    print("🌱 Seeding Quizz+ demo data...")
    
    # Clear existing data
    collections = ['quiz_themes', 'quiz_questions', 'fun_facts', 'badges', 'users', 'user_sessions']
    for collection in collections:
        db[collection].delete_many({})
    
    # Seed Quiz Themes
    themes = [
        {
            "theme_id": f"theme_{generate_id()}",
            "name": "Culture générale",
            "icon": "🎭",
            "description": "Testez vos connaissances générales",
            "color": "#FF6B35",
            "popular": True
        },
        {
            "theme_id": f"theme_{generate_id()}",
            "name": "Histoire d'Afrique",
            "icon": "🏛️",
            "description": "Découvrez l'histoire du continent africain",
            "color": "#C9A84C",
            "popular": True
        },
        {
            "theme_id": f"theme_{generate_id()}",
            "name": "Sciences",
            "icon": "🔬",
            "description": "Les merveilles de la science",
            "color": "#2ECC71",
            "popular": False
        },
        {
            "theme_id": f"theme_{generate_id()}",
            "name": "Géographie",
            "icon": "🌍",
            "description": "Explorez le monde",
            "color": "#3498DB",
            "popular": False
        },
        {
            "theme_id": f"theme_{generate_id()}",
            "name": "Littérature africaine",
            "icon": "📚",
            "description": "Les grands auteurs d'Afrique",
            "color": "#9B59B6",
            "popular": True
        },
        {
            "theme_id": f"theme_{generate_id()}",
            "name": "Sport",
            "icon": "⚽",
            "description": "Le sport en Afrique et dans le monde",
            "color": "#E74C3C",
            "popular": False
        }
    ]
    
    db.quiz_themes.insert_many(themes)
    print(f"✅ Inserted {len(themes)} themes")
    
    # Seed Quiz Questions
    questions = []
    for theme in themes:
        theme_questions = []
        
        if "Culture générale" in theme["name"]:
            theme_questions = [
                {
                    "question_id": f"q_{generate_id()}",
                    "theme_id": theme["theme_id"],
                    "question_text": "Quelle est la capitale du Sénégal ?",
                    "question_type": "mcq",
                    "options": ["Dakar", "Saint-Louis", "Thiès", "Ziguinchor"],
                    "correct_answer": "Dakar",
                    "explanation": "Dakar est la capitale du Sénégal depuis l'indépendance en 1960.",
                    "difficulty": 1
                },
                {
                    "question_id": f"q_{generate_id()}",
                    "theme_id": theme["theme_id"],
                    "question_text": "Combien de continents y a-t-il sur Terre ?",
                    "question_type": "mcq",
                    "options": ["5", "6", "7", "8"],
                    "correct_answer": "7",
                    "explanation": "Il y a 7 continents : Afrique, Amérique du Nord, Amérique du Sud, Antarctique, Asie, Europe et Océanie.",
                    "difficulty": 1
                },
                {
                    "question_id": f"q_{generate_id()}",
                    "theme_id": theme["theme_id"],
                    "question_text": "Quel est l'élément chimique avec le symbole 'O' ?",
                    "question_type": "mcq",
                    "options": ["Or", "Oxygène", "Osmium", "Olivier"],
                    "correct_answer": "Oxygène",
                    "explanation": "L'oxygène a pour symbole chimique 'O' dans le tableau périodique.",
                    "difficulty": 2
                }
            ]
        
        elif "Histoire" in theme["name"]:
            theme_questions = [
                {
                    "question_id": f"q_{generate_id()}",
                    "theme_id": theme["theme_id"],
                    "question_text": "Qui était Soundiata Keïta ?",
                    "question_type": "mcq",
                    "options": ["Un roi du Mali", "Un explorateur", "Un poète", "Un musicien"],
                    "correct_answer": "Un roi du Mali",
                    "explanation": "Soundiata Keïta fut le fondateur de l'Empire du Mali au 13e siècle.",
                    "difficulty": 2
                },
                {
                    "question_id": f"q_{generate_id()}",
                    "theme_id": theme["theme_id"],
                    "question_text": "Dans quelle année l'Afrique du Sud a-t-elle aboli l'apartheid ?",
                    "question_type": "mcq",
                    "options": ["1990", "1991", "1994", "1996"],
                    "correct_answer": "1994",
                    "explanation": "L'apartheid a officiellement pris fin en 1994 avec l'élection de Nelson Mandela.",
                    "difficulty": 3
                }
            ]
        
        else:
            # Generic questions for other themes
            theme_questions = [
                {
                    "question_id": f"q_{generate_id()}",
                    "theme_id": theme["theme_id"],
                    "question_text": f"Question exemple pour {theme['name']}",
                    "question_type": "mcq",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "Option A",
                    "explanation": "Ceci est une explication exemple.",
                    "difficulty": 1
                }
            ]
        
        # Add enough questions for each theme (minimum 10)
        while len(theme_questions) < 12:
            theme_questions.append({
                "question_id": f"q_{generate_id()}",
                "theme_id": theme["theme_id"],
                "question_text": f"Question supplémentaire {len(theme_questions)} pour {theme['name']}",
                "question_type": "mcq",
                "options": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
                "correct_answer": "Réponse A",
                "explanation": "Explication de la réponse correcte.",
                "difficulty": 2
            })
        
        questions.extend(theme_questions)
    
    db.quiz_questions.insert_many(questions)
    print(f"✅ Inserted {len(questions)} questions")
    
    # Seed Fun Facts
    fun_facts = [
        {
            "fact_id": f"fact_{generate_id()}",
            "theme_id": themes[0]["theme_id"],
            "title": "Le baobab millénaire",
            "content": "Certains baobabs d'Afrique peuvent vivre plus de 2000 ans et stocker jusqu'à 120 000 litres d'eau dans leur tronc !",
            "source": "National Geographic",
            "points": 2
        },
        {
            "fact_id": f"fact_{generate_id()}",
            "theme_id": themes[1]["theme_id"],
            "title": "L'écriture la plus ancienne",
            "content": "Les hiéroglyphes égyptiens comptent parmi les plus anciens systèmes d'écriture au monde, datant d'environ 3200 ans avant J.-C.",
            "source": "Encyclopédie Britannica",
            "points": 2
        },
        {
            "fact_id": f"fact_{generate_id()}",
            "theme_id": themes[2]["theme_id"],
            "title": "La diversité linguistique africaine",
            "content": "L'Afrique compte plus de 2000 langues différentes, soit environ un tiers de toutes les langues parlées dans le monde !",
            "source": "UNESCO",
            "points": 2
        }
    ]
    
    db.fun_facts.insert_many(fun_facts)
    print(f"✅ Inserted {len(fun_facts)} fun facts")
    
    # Seed Badges
    badges = [
        {
            "badge_id": "badge_streak_7",
            "name": "Habitué",
            "description": "Connecté 7 jours d'affilée",
            "icon": "🔥",
            "requirement": "7 days streak"
        },
        {
            "badge_id": "badge_perfect_score",
            "name": "Perfectionniste",
            "description": "Score parfait à un quiz",
            "icon": "⭐",
            "requirement": "Perfect quiz score"
        },
        {
            "badge_id": "badge_10_quizzes",
            "name": "Explorateur",
            "description": "10 quiz complétés",
            "icon": "🎯",
            "requirement": "10 completed quizzes"
        },
        {
            "badge_id": "badge_culture_master",
            "name": "Maître de culture",
            "description": "Expert en culture générale",
            "icon": "🎭",
            "requirement": "Culture theme mastery"
        },
        {
            "badge_id": "badge_history_buff",
            "name": "Passionné d'histoire",
            "description": "Expert en histoire africaine",
            "icon": "🏛️",
            "requirement": "History theme mastery"
        }
    ]
    
    db.badges.insert_many(badges)
    print(f"✅ Inserted {len(badges)} badges")
    
    print("🎉 Demo data seeding completed successfully!")
    
    # Print summary
    print("\n📊 Database Summary:")
    print(f"  • Themes: {db.quiz_themes.count_documents({})}")
    print(f"  • Questions: {db.quiz_questions.count_documents({})}")
    print(f"  • Fun Facts: {db.fun_facts.count_documents({})}")
    print(f"  • Badges: {db.badges.count_documents({})}")

if __name__ == "__main__":
    seed_database()
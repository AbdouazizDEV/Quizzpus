#!/usr/bin/env python3
"""
Backend API Testing for Quizz+ Application
Tests all API endpoints with proper authentication and validation
"""

import requests
import sys
from datetime import datetime
import json
import uuid

class QuizzPlusAPITester:
    def __init__(self, base_url="https://quizzplus-edu.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def make_request(self, method, endpoint, data=None, expect_status=200):
        """Make API request with proper headers"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            
            success = response.status_code == expect_status
            result = {}
            
            try:
                result = response.json()
            except:
                result = {"text": response.text}
            
            return success, response.status_code, result
            
        except Exception as e:
            return False, 0, {"error": str(e)}

    def test_user_registration(self):
        """Test user registration endpoint"""
        timestamp = int(datetime.now().timestamp())
        test_data = {
            "email": f"test.user.{timestamp}@example.com",
            "password": "TestPass123!",
            "first_name": "Test",
            "last_name": "User"
        }
        
        success, status, response = self.make_request('POST', 'auth/register', test_data, 200)
        
        if success and 'session_token' in response:
            self.session_token = response['session_token']
            self.user_id = response['user']['user_id']
            self.log_test("User Registration", True)
            return True
        else:
            self.log_test("User Registration", False, f"Status: {status}, Response: {response}")
            return False

    def test_user_login(self):
        """Test user login endpoint - will create user first if registration failed"""
        if not self.session_token:
            # Try to login with default user or create one via registration
            test_data = {
                "email": "test@example.com",
                "password": "TestPass123!"
            }
            
            success, status, response = self.make_request('POST', 'auth/login', test_data, 200)
            
            if not success:
                # If login fails, try registration first
                self.test_user_registration()
                return True
            
            if 'session_token' in response:
                self.session_token = response['session_token']
                self.user_id = response['user']['user_id']
                self.log_test("User Login", True)
                return True
        
        self.log_test("User Login", False, "No session token received")
        return False

    def test_auth_me(self):
        """Test get current user endpoint"""
        success, status, response = self.make_request('GET', 'auth/me')
        
        if success and 'user_id' in response:
            self.log_test("Get Current User", True)
            return True
        else:
            self.log_test("Get Current User", False, f"Status: {status}")
            return False

    def test_get_themes(self):
        """Test get quiz themes endpoint"""
        success, status, response = self.make_request('GET', 'themes')
        
        if success and isinstance(response, list):
            self.log_test("Get Themes", True, f"Found {len(response)} themes")
            return True
        else:
            self.log_test("Get Themes", False, f"Status: {status}")
            return False

    def test_daily_quiz(self):
        """Test get daily quiz endpoint"""
        success, status, response = self.make_request('GET', 'quiz/daily')
        
        if success and ('theme_id' in response or len(response) == 0):
            self.log_test("Get Daily Quiz", True)
            return True
        else:
            self.log_test("Get Daily Quiz", False, f"Status: {status}")
            return False

    def test_fun_facts(self):
        """Test get daily fun fact endpoint"""
        success, status, response = self.make_request('GET', 'fun-facts/daily')
        
        if success and ('fact_id' in response or len(response) == 0):
            self.log_test("Get Daily Fun Fact", True)
            return True
        else:
            self.log_test("Get Daily Fun Fact", False, f"Status: {status}")
            return False

    def test_user_profile(self):
        """Test get user profile endpoint"""
        success, status, response = self.make_request('GET', 'user/profile')
        
        if success and 'user_id' in response:
            self.log_test("Get User Profile", True)
            return True
        else:
            self.log_test("Get User Profile", False, f"Status: {status}")
            return False

    def test_user_badges(self):
        """Test get user badges endpoint"""
        success, status, response = self.make_request('GET', 'user/badges')
        
        if success and isinstance(response, list):
            self.log_test("Get User Badges", True, f"Found {len(response)} badges")
            return True
        else:
            self.log_test("Get User Badges", False, f"Status: {status}")
            return False

    def test_leaderboard_global(self):
        """Test global leaderboard endpoint"""
        success, status, response = self.make_request('GET', 'leaderboard/global')
        
        if success and 'leaderboard' in response:
            self.log_test("Global Leaderboard", True)
            return True
        else:
            self.log_test("Global Leaderboard", False, f"Status: {status}")
            return False

    def test_notifications(self):
        """Test get notifications endpoint"""
        success, status, response = self.make_request('GET', 'notifications')
        
        if success and isinstance(response, list):
            self.log_test("Get Notifications", True, f"Found {len(response)} notifications")
            return True
        else:
            self.log_test("Get Notifications", False, f"Status: {status}")
            return False

    def test_theme_quiz(self):
        """Test getting quiz for a specific theme"""
        # First get themes
        themes_success, _, themes_response = self.make_request('GET', 'themes')
        
        if themes_success and themes_response and len(themes_response) > 0:
            theme_id = themes_response[0]['theme_id']
            success, status, response = self.make_request('GET', f'themes/{theme_id}/quiz')
            
            if success and isinstance(response, list) and len(response) >= 1:
                self.log_test("Get Theme Quiz", True, f"Found {len(response)} questions")
                return True, response, theme_id
            else:
                self.log_test("Get Theme Quiz", False, f"Status: {status}")
                return False, None, None
        else:
            self.log_test("Get Theme Quiz", False, "No themes available")
            return False, None, None

    def test_quiz_submission(self):
        """Test quiz submission endpoint"""
        # Get quiz questions first
        success, questions, theme_id = self.test_theme_quiz()
        
        if not success or not questions:
            return False
        
        # Submit answers (all first option)
        answers = [questions[i]['options'][0] for i in range(min(10, len(questions)))]
        
        submission_data = {
            "theme_id": theme_id,
            "answers": answers,
            "time_taken": 60
        }
        
        success, status, response = self.make_request('POST', 'quiz/submit', submission_data)
        
        if success and 'score' in response:
            self.log_test("Quiz Submission", True, f"Score: {response.get('score', 0)}")
            return True
        else:
            self.log_test("Quiz Submission", False, f"Status: {status}")
            return False

    def test_update_profile(self):
        """Test update user profile endpoint"""
        update_data = {
            "country": "Sénégal",
            "favorite_themes": ["Culture générale", "Histoire"]
        }
        
        success, status, response = self.make_request('PUT', 'user/profile', update_data)
        
        if success and 'user_id' in response:
            self.log_test("Update User Profile", True)
            return True
        else:
            self.log_test("Update User Profile", False, f"Status: {status}")
            return False

    def test_logout(self):
        """Test logout endpoint"""
        success, status, response = self.make_request('POST', 'auth/logout')
        
        if success or status == 200:
            self.log_test("User Logout", True)
            return True
        else:
            self.log_test("User Logout", False, f"Status: {status}")
            return False

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🧪 Starting Quizz+ API Testing...")
        print(f"🌐 Base URL: {self.base_url}")
        print("-" * 50)
        
        # Authentication tests
        if not self.test_user_registration():
            # Try login if registration fails
            if not self.test_user_login():
                print("❌ Cannot proceed without authentication")
                return False
        
        # Protected endpoint tests
        self.test_auth_me()
        self.test_user_profile()
        self.test_get_themes()
        self.test_daily_quiz()
        self.test_fun_facts()
        self.test_user_badges()
        self.test_leaderboard_global()
        self.test_notifications()
        
        # Quiz flow tests
        self.test_quiz_submission()
        
        # Profile update test
        self.test_update_profile()
        
        # Cleanup
        self.test_logout()
        
        # Results summary
        print("-" * 50)
        print(f"📊 Tests completed: {self.tests_passed}/{self.tests_run}")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✅ Success rate: {success_rate:.1f}%")
        
        # Detailed failures
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"  • {test['name']}: {test['details']}")
        
        return success_rate > 80

def main():
    """Main test execution"""
    try:
        tester = QuizzPlusAPITester()
        success = tester.run_all_tests()
        return 0 if success else 1
    except Exception as e:
        print(f"💥 Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
#!/usr/bin/env python3
"""
Mystic Host Backend API Test Suite
Tests all backend endpoints to ensure proper functionality
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://podemos-editor.preview.emergentagent.com/api"

class MysticHostAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}: {message}")
        
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
    
    def test_health_check(self):
        """Test GET /api/ endpoint for health check"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "status" in data:
                    self.log_test(
                        "Health Check", 
                        True, 
                        f"API is healthy - {data.get('message')}", 
                        data
                    )
                else:
                    self.log_test(
                        "Health Check", 
                        False, 
                        "Response missing required fields", 
                        data
                    )
            else:
                self.log_test(
                    "Health Check", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Health Check", False, f"Request failed: {str(e)}")
    
    def test_get_servers(self):
        """Test GET /api/servers endpoint"""
        try:
            response = requests.get(f"{self.base_url}/servers", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "servers" in data and isinstance(data["servers"], list):
                    servers = data["servers"]
                    if len(servers) > 0:
                        # Validate server structure
                        server = servers[0]
                        required_fields = ["id", "name", "players", "price", "ram", "storage", "status", "image"]
                        missing_fields = [field for field in required_fields if field not in server]
                        
                        if not missing_fields:
                            self.log_test(
                                "Get Game Servers", 
                                True, 
                                f"Retrieved {len(servers)} servers successfully", 
                                {"server_count": len(servers), "sample_server": server}
                            )
                        else:
                            self.log_test(
                                "Get Game Servers", 
                                False, 
                                f"Server missing required fields: {missing_fields}", 
                                data
                            )
                    else:
                        self.log_test(
                            "Get Game Servers", 
                            False, 
                            "No servers found in database", 
                            data
                        )
                else:
                    self.log_test(
                        "Get Game Servers", 
                        False, 
                        "Invalid response format - missing 'servers' array", 
                        data
                    )
            else:
                self.log_test(
                    "Get Game Servers", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Game Servers", False, f"Request failed: {str(e)}")
    
    def test_get_pricing_plans(self):
        """Test GET /api/pricing-plans endpoint"""
        try:
            response = requests.get(f"{self.base_url}/pricing-plans", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "plans" in data and isinstance(data["plans"], list):
                    plans = data["plans"]
                    if len(plans) > 0:
                        # Validate plan structure
                        plan = plans[0]
                        required_fields = ["id", "name", "price", "period", "description", "features", "popular"]
                        missing_fields = [field for field in required_fields if field not in plan]
                        
                        if not missing_fields:
                            self.log_test(
                                "Get Pricing Plans", 
                                True, 
                                f"Retrieved {len(plans)} pricing plans successfully", 
                                {"plan_count": len(plans), "sample_plan": plan}
                            )
                        else:
                            self.log_test(
                                "Get Pricing Plans", 
                                False, 
                                f"Plan missing required fields: {missing_fields}", 
                                data
                            )
                    else:
                        self.log_test(
                            "Get Pricing Plans", 
                            False, 
                            "No pricing plans found in database", 
                            data
                        )
                else:
                    self.log_test(
                        "Get Pricing Plans", 
                        False, 
                        "Invalid response format - missing 'plans' array", 
                        data
                    )
            else:
                self.log_test(
                    "Get Pricing Plans", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Pricing Plans", False, f"Request failed: {str(e)}")
    
    def test_get_dashboard_stats(self):
        """Test GET /api/dashboard/stats endpoint"""
        try:
            response = requests.get(f"{self.base_url}/dashboard/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "stats" in data and isinstance(data["stats"], list):
                    stats = data["stats"]
                    if len(stats) > 0:
                        # Validate stats structure
                        stat = stats[0]
                        required_fields = ["title", "value", "change", "trend"]
                        missing_fields = [field for field in required_fields if field not in stat]
                        
                        if not missing_fields:
                            self.log_test(
                                "Get Dashboard Stats", 
                                True, 
                                f"Retrieved {len(stats)} dashboard statistics successfully", 
                                {"stats_count": len(stats), "sample_stat": stat}
                            )
                        else:
                            self.log_test(
                                "Get Dashboard Stats", 
                                False, 
                                f"Stat missing required fields: {missing_fields}", 
                                data
                            )
                    else:
                        self.log_test(
                            "Get Dashboard Stats", 
                            False, 
                            "No dashboard stats found", 
                            data
                        )
                else:
                    self.log_test(
                        "Get Dashboard Stats", 
                        False, 
                        "Invalid response format - missing 'stats' array", 
                        data
                    )
            else:
                self.log_test(
                    "Get Dashboard Stats", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Dashboard Stats", False, f"Request failed: {str(e)}")
    
    def test_get_testimonials(self):
        """Test GET /api/testimonials endpoint"""
        try:
            response = requests.get(f"{self.base_url}/testimonials", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "testimonials" in data and isinstance(data["testimonials"], list):
                    testimonials = data["testimonials"]
                    if len(testimonials) > 0:
                        # Validate testimonial structure
                        testimonial = testimonials[0]
                        required_fields = ["id", "name", "role", "content", "avatar", "rating", "approved"]
                        missing_fields = [field for field in required_fields if field not in testimonial]
                        
                        if not missing_fields:
                            # Check that only approved testimonials are returned
                            all_approved = all(t.get("approved", False) for t in testimonials)
                            if all_approved:
                                self.log_test(
                                    "Get Testimonials", 
                                    True, 
                                    f"Retrieved {len(testimonials)} approved testimonials successfully", 
                                    {"testimonial_count": len(testimonials), "sample_testimonial": testimonial}
                                )
                            else:
                                self.log_test(
                                    "Get Testimonials", 
                                    False, 
                                    "Found unapproved testimonials in response", 
                                    data
                                )
                        else:
                            self.log_test(
                                "Get Testimonials", 
                                False, 
                                f"Testimonial missing required fields: {missing_fields}", 
                                data
                            )
                    else:
                        self.log_test(
                            "Get Testimonials", 
                            False, 
                            "No testimonials found in database", 
                            data
                        )
                else:
                    self.log_test(
                        "Get Testimonials", 
                        False, 
                        "Invalid response format - missing 'testimonials' array", 
                        data
                    )
            else:
                self.log_test(
                    "Get Testimonials", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Get Testimonials", False, f"Request failed: {str(e)}")
    
    def test_submit_support_request(self):
        """Test POST /api/support/contact endpoint"""
        try:
            # Sample support request data
            support_data = {
                "name": "Carlos Mendes",
                "email": "carlos.mendes@email.com",
                "subject": "Problema com servidor Minecraft",
                "message": "Estou enfrentando problemas de conectividade com meu servidor Minecraft. Os jogadores estão relatando lag constante e desconexões frequentes. Preciso de ajuda urgente para resolver essa situação.",
                "priority": "high"
            }
            
            response = requests.post(
                f"{self.base_url}/support/contact", 
                json=support_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "request_id" in data:
                    self.log_test(
                        "Submit Support Request", 
                        True, 
                        f"Support request submitted successfully - ID: {data['request_id']}", 
                        data
                    )
                else:
                    self.log_test(
                        "Submit Support Request", 
                        False, 
                        "Response missing required fields (message, request_id)", 
                        data
                    )
            else:
                self.log_test(
                    "Submit Support Request", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Submit Support Request", False, f"Request failed: {str(e)}")
    
    def test_user_registration(self):
        """Test POST /api/auth/register endpoint"""
        try:
            # Test data as specified in the review request
            registration_data = {
                "name": "João Test",
                "email": "joao.test@example.com",
                "password": "senhaSegura123"
            }
            
            response = requests.post(
                f"{self.base_url}/auth/register", 
                json=registration_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 201:
                data = response.json()
                if "user" in data and "token" in data and "message" in data:
                    user = data["user"]
                    if user.get("email") == registration_data["email"] and user.get("name") == registration_data["name"]:
                        self.log_test(
                            "User Registration", 
                            True, 
                            f"User registered successfully - {user['name']} ({user['email']})", 
                            {"user_id": user.get("id"), "email": user["email"]}
                        )
                        # Store token for later tests
                        self.auth_token = data["token"]
                    else:
                        self.log_test(
                            "User Registration", 
                            False, 
                            "User data mismatch in response", 
                            data
                        )
                else:
                    self.log_test(
                        "User Registration", 
                        False, 
                        "Response missing required fields (user, token, message)", 
                        data
                    )
            elif response.status_code == 400:
                # User might already exist, which is acceptable
                data = response.json()
                if "already exists" in data.get("detail", "").lower():
                    self.log_test(
                        "User Registration", 
                        True, 
                        "User already exists - registration validation working correctly", 
                        data
                    )
                else:
                    self.log_test(
                        "User Registration", 
                        False, 
                        f"HTTP 400: {data.get('detail', response.text)}", 
                        data
                    )
            else:
                self.log_test(
                    "User Registration", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("User Registration", False, f"Request failed: {str(e)}")
    
    def test_user_login(self):
        """Test POST /api/auth/login endpoint"""
        try:
            # Test data as specified in the review request
            login_data = {
                "email": "joao.test@example.com",
                "password": "senhaSegura123"
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login", 
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data and "message" in data:
                    user = data["user"]
                    if user.get("email") == login_data["email"]:
                        self.log_test(
                            "User Login", 
                            True, 
                            f"User logged in successfully - {user['name']} ({user['email']})", 
                            {"user_id": user.get("id"), "email": user["email"]}
                        )
                        # Store token for verification test
                        self.auth_token = data["token"]
                    else:
                        self.log_test(
                            "User Login", 
                            False, 
                            "User email mismatch in response", 
                            data
                        )
                else:
                    self.log_test(
                        "User Login", 
                        False, 
                        "Response missing required fields (user, token, message)", 
                        data
                    )
            else:
                self.log_test(
                    "User Login", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("User Login", False, f"Request failed: {str(e)}")
    
    def test_token_verification(self):
        """Test GET /api/auth/verify endpoint"""
        try:
            # Use token from login test if available
            if not hasattr(self, 'auth_token'):
                self.log_test(
                    "Token Verification", 
                    False, 
                    "No auth token available - login test must run first"
                )
                return
            
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/auth/verify", 
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "message" in data:
                    user = data["user"]
                    self.log_test(
                        "Token Verification", 
                        True, 
                        f"Token verified successfully for user {user.get('name', 'Unknown')}", 
                        {"user_id": user.get("id"), "email": user.get("email")}
                    )
                else:
                    self.log_test(
                        "Token Verification", 
                        False, 
                        "Response missing required fields (user, message)", 
                        data
                    )
            else:
                self.log_test(
                    "Token Verification", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Token Verification", False, f"Request failed: {str(e)}")
    
    def test_support_request_with_provided_data(self):
        """Test POST /api/support/contact endpoint with provided test data"""
        try:
            # Test data as specified in the review request
            support_data = {
                "name": "Maria Silva",
                "email": "maria@example.com",
                "subject": "Dúvida sobre servidor",
                "message": "Gostaria de saber mais sobre os planos de Minecraft."
            }
            
            response = requests.post(
                f"{self.base_url}/support/contact", 
                json=support_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "request_id" in data:
                    self.log_test(
                        "Support Request (Provided Data)", 
                        True, 
                        f"Support request submitted successfully - ID: {data['request_id']}", 
                        data
                    )
                else:
                    self.log_test(
                        "Support Request (Provided Data)", 
                        False, 
                        "Response missing required fields (message, request_id)", 
                        data
                    )
            else:
                self.log_test(
                    "Support Request (Provided Data)", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Support Request (Provided Data)", False, f"Request failed: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for invalid endpoints"""
        try:
            # Test non-existent endpoint
            response = requests.get(f"{self.base_url}/nonexistent", timeout=10)
            
            if response.status_code == 404:
                self.log_test(
                    "Error Handling - 404", 
                    True, 
                    "Correctly returns 404 for non-existent endpoint"
                )
            else:
                self.log_test(
                    "Error Handling - 404", 
                    False, 
                    f"Expected 404, got {response.status_code}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling - 404", False, f"Request failed: {str(e)}")
        
        try:
            # Test invalid support request (missing required fields)
            invalid_data = {"name": "Test User"}  # Missing required fields
            
            response = requests.post(
                f"{self.base_url}/support/contact", 
                json=invalid_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 422:  # FastAPI validation error
                self.log_test(
                    "Error Handling - Validation", 
                    True, 
                    "Correctly validates required fields in POST requests"
                )
            else:
                self.log_test(
                    "Error Handling - Validation", 
                    False, 
                    f"Expected 422 validation error, got {response.status_code}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling - Validation", False, f"Request failed: {str(e)}")
        
        try:
            # Test invalid login credentials
            invalid_login = {
                "email": "nonexistent@example.com",
                "password": "wrongpassword"
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login", 
                json=invalid_login,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 401:
                self.log_test(
                    "Error Handling - Invalid Login", 
                    True, 
                    "Correctly returns 401 for invalid credentials"
                )
            else:
                self.log_test(
                    "Error Handling - Invalid Login", 
                    False, 
                    f"Expected 401 for invalid login, got {response.status_code}"
                )
                
        except requests.exceptions.RequestException as e:
            self.log_test("Error Handling - Invalid Login", False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("=" * 60)
        print("MYSTIC HOST BACKEND API TEST SUITE")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print("-" * 60)
        
        # Initialize auth token storage
        self.auth_token = None
        
        # Run all tests
        self.test_health_check()
        self.test_get_servers()
        self.test_get_pricing_plans()
        self.test_get_dashboard_stats()
        self.test_get_testimonials()
        self.test_submit_support_request()
        self.test_support_request_with_provided_data()
        
        # Authentication tests
        self.test_user_registration()
        self.test_user_login()
        self.test_token_verification()
        
        # Error handling tests
        self.test_error_handling()
        
        # Summary
        print("-" * 60)
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"TEST SUMMARY:")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("=" * 60)
        
        return passed_tests == total_tests

if __name__ == "__main__":
    tester = MysticHostAPITester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)
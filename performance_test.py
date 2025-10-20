#!/usr/bin/env python3
"""
Performance Test for Mystic Host Backend APIs
Tests response times and performance after technical improvements
"""

import requests
import time
import statistics
from datetime import datetime

BACKEND_URL = "https://podemos-editor.preview.emergentagent.com/api"

class PerformanceTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.results = {}
        
    def measure_endpoint_performance(self, endpoint, method="GET", data=None, iterations=5):
        """Measure performance of an endpoint"""
        times = []
        
        for i in range(iterations):
            start_time = time.time()
            
            try:
                if method == "GET":
                    response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                elif method == "POST":
                    response = requests.post(
                        f"{self.base_url}{endpoint}", 
                        json=data,
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                
                end_time = time.time()
                response_time = (end_time - start_time) * 1000  # Convert to milliseconds
                
                if response.status_code in [200, 201]:
                    times.append(response_time)
                else:
                    print(f"Warning: {endpoint} returned status {response.status_code}")
                    
            except Exception as e:
                print(f"Error testing {endpoint}: {e}")
                continue
        
        if times:
            avg_time = statistics.mean(times)
            min_time = min(times)
            max_time = max(times)
            
            self.results[endpoint] = {
                "average_ms": round(avg_time, 2),
                "min_ms": round(min_time, 2),
                "max_ms": round(max_time, 2),
                "iterations": len(times)
            }
            
            print(f"✅ {endpoint}: Avg {avg_time:.2f}ms, Min {min_time:.2f}ms, Max {max_time:.2f}ms")
        else:
            print(f"❌ {endpoint}: No successful responses")
    
    def run_performance_tests(self):
        """Run performance tests on all endpoints"""
        print("=" * 70)
        print("MYSTIC HOST BACKEND PERFORMANCE TEST")
        print("=" * 70)
        print(f"Testing backend at: {self.base_url}")
        print(f"Running 5 iterations per endpoint...")
        print("-" * 70)
        
        # Test GET endpoints
        self.measure_endpoint_performance("/")
        self.measure_endpoint_performance("/servers")
        self.measure_endpoint_performance("/pricing-plans")
        self.measure_endpoint_performance("/dashboard/stats")
        self.measure_endpoint_performance("/testimonials")
        
        # Test POST endpoints
        support_data = {
            "name": "Performance Test User",
            "email": "perf.test@example.com",
            "subject": "Performance Test",
            "message": "Testing API performance after improvements."
        }
        self.measure_endpoint_performance("/support/contact", "POST", support_data)
        
        # Test authentication endpoints
        login_data = {
            "email": "joao.test@example.com",
            "password": "senhaSegura123"
        }
        self.measure_endpoint_performance("/auth/login", "POST", login_data)
        
        print("-" * 70)
        print("PERFORMANCE SUMMARY:")
        print("-" * 70)
        
        total_avg = 0
        count = 0
        
        for endpoint, metrics in self.results.items():
            avg = metrics["average_ms"]
            total_avg += avg
            count += 1
            
            # Performance rating
            if avg < 100:
                rating = "🟢 Excellent"
            elif avg < 300:
                rating = "🟡 Good"
            elif avg < 500:
                rating = "🟠 Fair"
            else:
                rating = "🔴 Slow"
            
            print(f"{endpoint:25} | {avg:6.2f}ms avg | {rating}")
        
        if count > 0:
            overall_avg = total_avg / count
            print("-" * 70)
            print(f"Overall Average Response Time: {overall_avg:.2f}ms")
            
            if overall_avg < 100:
                print("🟢 Overall Performance: EXCELLENT")
            elif overall_avg < 300:
                print("🟡 Overall Performance: GOOD")
            elif overall_avg < 500:
                print("🟠 Overall Performance: FAIR")
            else:
                print("🔴 Overall Performance: NEEDS IMPROVEMENT")
        
        print("=" * 70)

if __name__ == "__main__":
    tester = PerformanceTester()
    tester.run_performance_tests()
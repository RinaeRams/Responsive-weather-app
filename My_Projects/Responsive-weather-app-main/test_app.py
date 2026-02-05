#!/usr/bin/env python3
"""
Test script for the Weather App
"""
import sys
import json
from app import app

def test_app():
    """Test the Flask application functionality"""
    print("Testing Weather App...")
    
    # Create test client
    with app.test_client() as client:
        # Test main page
        print("1. Testing main page...")
        response = client.get('/')
        if response.status_code == 200:
            print("✅ Main page loads successfully")
        else:
            print(f"❌ Main page failed with status {response.status_code}")
            
        # Test current weather API
        print("2. Testing current weather API...")
        response = client.get('/api/weather/current?city=London')
        if response.status_code == 200:
            data = json.loads(response.data)
            print("✅ Current weather API works")
            print(f"   City: {data['city']}")
            print(f"   Temperature: {data['temperature']}°C")
            print(f"   Description: {data['description']}")
        else:
            print(f"❌ Current weather API failed with status {response.status_code}")
            
        # Test forecast API
        print("3. Testing forecast API...")
        response = client.get('/api/weather/forecast?city=Paris')
        if response.status_code == 200:
            data = json.loads(response.data)
            print("✅ Forecast API works")
            print(f"   City: {data['city']}")
            print(f"   Forecast items: {len(data['forecast'])}")
        else:
            print(f"❌ Forecast API failed with status {response.status_code}")
            
        # Test search API
        print("4. Testing search API...")
        response = client.get('/api/weather/search?q=New')
        if response.status_code == 200:
            data = json.loads(response.data)
            print("✅ Search API works")
            print(f"   Found {len(data)} cities")
            if data:
                print(f"   First result: {data[0]['name']}, {data[0]['country']}")
        else:
            print(f"❌ Search API failed with status {response.status_code}")
    
    print("\n🎉 All tests completed!")
    print("\nTo run the app:")
    print("python3 app.py")
    print("Then open http://localhost:5000 in your browser")

if __name__ == '__main__':
    test_app()
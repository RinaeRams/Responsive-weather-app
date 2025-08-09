from flask import Flask, render_template, jsonify, request
import requests
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)

# OpenWeatherMap API configuration
API_KEY = os.getenv('OPENWEATHER_API_KEY', 'demo_key')  # Get from environment or use demo
BASE_URL = "http://api.openweathermap.org/data/2.5"

# Demo data for when API key is not available
DEMO_WEATHER_DATA = {
    'city': 'London',
    'country': 'GB',
    'temperature': 22,
    'feels_like': 24,
    'description': 'Partly Cloudy',
    'icon': '02d',
    'humidity': 65,
    'pressure': 1013,
    'wind_speed': 3.5,
    'wind_direction': 180,
    'visibility': 10.0,
    'sunrise': '06:30',
    'sunset': '19:45',
    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/weather/current')
def get_current_weather():
    city = request.args.get('city', 'London')
    
    # If no API key is set, return demo data
    if API_KEY == 'demo_key':
        demo_data = DEMO_WEATHER_DATA.copy()
        demo_data['city'] = city
        return jsonify(demo_data)
    
    try:
        # Current weather
        url = f"{BASE_URL}/weather"
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            weather_data = {
                'city': data['name'],
                'country': data['sys']['country'],
                'temperature': round(data['main']['temp']),
                'feels_like': round(data['main']['feels_like']),
                'description': data['weather'][0]['description'].title(),
                'icon': data['weather'][0]['icon'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'wind_speed': data['wind']['speed'],
                'wind_direction': data['wind'].get('deg', 0),
                'visibility': data.get('visibility', 0) / 1000,  # Convert to km
                'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M'),
                'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M'),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            return jsonify(weather_data)
        else:
            return jsonify({'error': 'City not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather/forecast')
def get_forecast():
    city = request.args.get('city', 'London')
    
    # If no API key is set, return demo forecast data
    if API_KEY == 'demo_key':
        demo_forecast = []
        base_temp = 20
        icons = ['01d', '02d', '03d', '10d', '04d']
        descriptions = ['Clear Sky', 'Few Clouds', 'Scattered Clouds', 'Light Rain', 'Broken Clouds']
        
        for i in range(40):  # 5 days * 8 forecasts per day
            temp_variation = (i % 8 - 4) * 2  # Temperature variation throughout day
            forecast_item = {
                'datetime': (datetime.now() + timedelta(hours=i*3)).strftime('%Y-%m-%d %H:%M:%S'),
                'date': (datetime.now() + timedelta(hours=i*3)).strftime('%Y-%m-%d'),
                'time': (datetime.now() + timedelta(hours=i*3)).strftime('%H:%M'),
                'temperature': base_temp + temp_variation + (i // 8),
                'feels_like': base_temp + temp_variation + (i // 8) + 2,
                'temp_min': base_temp + temp_variation + (i // 8) - 2,
                'temp_max': base_temp + temp_variation + (i // 8) + 3,
                'description': descriptions[i % len(descriptions)],
                'icon': icons[i % len(icons)],
                'humidity': 60 + (i % 20),
                'wind_speed': 2.5 + (i % 5),
                'pop': (i * 5) % 80  # Probability of precipitation
            }
            demo_forecast.append(forecast_item)
        
        return jsonify({
            'city': city,
            'country': 'Demo',
            'forecast': demo_forecast
        })
    
    try:
        # 5-day forecast
        url = f"{BASE_URL}/forecast"
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            forecast_data = []
            for item in data['list'][:40]:  # 5 days * 8 forecasts per day
                forecast_item = {
                    'datetime': item['dt_txt'],
                    'date': datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d'),
                    'time': datetime.fromtimestamp(item['dt']).strftime('%H:%M'),
                    'temperature': round(item['main']['temp']),
                    'feels_like': round(item['main']['feels_like']),
                    'temp_min': round(item['main']['temp_min']),
                    'temp_max': round(item['main']['temp_max']),
                    'description': item['weather'][0]['description'].title(),
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed'],
                    'pop': round(item.get('pop', 0) * 100)  # Probability of precipitation
                }
                forecast_data.append(forecast_item)
            
            return jsonify({
                'city': data['city']['name'],
                'country': data['city']['country'],
                'forecast': forecast_data
            })
        else:
            return jsonify({'error': 'City not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather/search')
def search_cities():
    query = request.args.get('q', '')
    
    if len(query) < 2:
        return jsonify([])
    
    # If no API key is set, return demo cities
    if API_KEY == 'demo_key':
        demo_cities = [
            {'name': 'London', 'country': 'GB', 'state': '', 'lat': 51.5074, 'lon': -0.1278},
            {'name': 'New York', 'country': 'US', 'state': 'NY', 'lat': 40.7128, 'lon': -74.0060},
            {'name': 'Tokyo', 'country': 'JP', 'state': '', 'lat': 35.6762, 'lon': 139.6503},
            {'name': 'Paris', 'country': 'FR', 'state': '', 'lat': 48.8566, 'lon': 2.3522},
            {'name': 'Sydney', 'country': 'AU', 'state': 'NSW', 'lat': -33.8688, 'lon': 151.2093}
        ]
        
        # Filter cities based on query
        filtered_cities = [city for city in demo_cities if query.lower() in city['name'].lower()]
        return jsonify(filtered_cities)
    
    try:
        # Use geocoding API to search for cities
        url = "http://api.openweathermap.org/geo/1.0/direct"
        params = {
            'q': query,
            'limit': 5,
            'appid': API_KEY
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            cities = []
            
            for item in data:
                city = {
                    'name': item['name'],
                    'country': item['country'],
                    'state': item.get('state', ''),
                    'lat': item['lat'],
                    'lon': item['lon']
                }
                cities.append(city)
            
            return jsonify(cities)
        else:
            return jsonify([])
            
    except Exception as e:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
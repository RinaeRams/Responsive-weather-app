#!/bin/bash

# WeatherScope - Beautiful Weather App Startup Script

echo "🌤️  Starting WeatherScope Weather App..."
echo "========================================"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking dependencies..."
python3 -c "import flask, requests" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📥 Installing required packages..."
    python3 -m pip install --break-system-packages -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please check your Python installation."
        exit 1
    fi
fi

echo "✅ Dependencies are ready!"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Using demo mode."
    echo "   To use real weather data, get an API key from openweathermap.org"
    echo "   and create a .env file with: OPENWEATHER_API_KEY=your_key_here"
else
    echo "✅ Environment configuration found"
fi

echo ""
echo "🚀 Starting Flask server..."
echo "   App will be available at: http://localhost:5000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the Flask application
python3 app.py
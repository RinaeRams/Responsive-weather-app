# WeatherScope - Beautiful Dynamic Weather App

A stunning, responsive weather web application built with Python Flask backend and modern HTML/CSS/JavaScript frontend. Features beautiful animations, dynamic backgrounds, and comprehensive weather data for any location worldwide.

## ✨ Features

- **🌍 Global Weather Data**: Search and get weather for any city worldwide
- **📱 Fully Responsive**: Beautiful design that works on all devices
- **🎨 Dynamic Backgrounds**: Background changes based on weather conditions
- **🌧️ Weather Animations**: Rain effects and floating clouds
- **📊 Comprehensive Data**: Current weather, 5-day forecast, and hourly predictions
- **🔍 Smart Search**: Auto-complete city search with suggestions
- **📍 Geolocation**: Automatic weather for your current location
- **⚡ Fast & Smooth**: Optimized performance with beautiful transitions
- **🎭 Beautiful UI**: Modern glassmorphism design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenWeatherMap API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🛠️ Technology Stack

### Backend
- **Python Flask**: Lightweight web framework
- **Requests**: HTTP library for API calls
- **OpenWeatherMap API**: Weather data source

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
  - Flexbox & Grid layouts
  - CSS animations & transitions
  - Glassmorphism effects
  - Responsive design
- **JavaScript ES6+**: Dynamic functionality
  - Async/await for API calls
  - Class-based architecture
  - DOM manipulation
  - Touch gesture support

## 📁 Project Structure

```
weather-app/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Styles and animations
    └── js/
        └── script.js     # JavaScript functionality
```

## 🌤️ Weather Features

### Current Weather
- Temperature (actual and feels-like)
- Weather description and icon
- Humidity, pressure, visibility
- Wind speed and direction
- Sunrise and sunset times

### 5-Day Forecast
- Daily temperature highs and lows
- Weather conditions
- Precipitation probability
- Wind and humidity data

### Hourly Forecast
- Next 24 hours weather
- 3-hour interval updates
- Temperature trends
- Weather condition changes

### Location Features
- City search with auto-complete
- Geolocation support
- International city support
- State/country information

## 🎨 Design Features

### Animations
- Floating clouds background
- Rain animation for rainy weather
- Smooth transitions and hover effects
- Loading spinners and state changes
- Icon animations and bouncing effects

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Swipe gesture support

### Dynamic Themes
- Background changes based on weather:
  - Clear skies: Blue gradient
  - Cloudy: Dark blue gradient
  - Rainy: Green-gray gradient
  - Snowy: Light gray gradient
  - Thunderstorm: Dark gradient

## 🔧 Configuration

### Environment Variables
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
- `FLASK_ENV`: development/production
- `FLASK_DEBUG`: True/False

### API Endpoints
- `GET /`: Main application page
- `GET /api/weather/current?city=<city>`: Current weather data
- `GET /api/weather/forecast?city=<city>`: 5-day forecast
- `GET /api/weather/search?q=<query>`: City search suggestions

## 🌟 Usage Tips

1. **Search**: Type any city name to get instant suggestions
2. **Geolocation**: Allow location access for automatic local weather
3. **Navigation**: Use keyboard (Enter, Escape) for better accessibility
4. **Mobile**: Swipe gestures supported for future features

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production with Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Docker (Optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 📱 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Font Awesome](https://fontawesome.com/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for Inter font family

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your OpenWeatherMap API key is valid and set in `.env`
2. **City Not Found**: Try searching with more specific terms or include country
3. **Loading Issues**: Check your internet connection and API limits
4. **Mobile Issues**: Ensure you're using a modern mobile browser

### Support

For issues and questions, please open an issue on the repository or contact the development team.

---

Made with ❤️ for beautiful weather experiences

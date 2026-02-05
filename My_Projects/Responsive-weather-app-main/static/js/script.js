// Weather App JavaScript - Enhanced with Null Safety
class WeatherApp {
    constructor() {
        this.currentCity = 'London';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadWeatherData(this.currentCity);
        this.updateCurrentTime();
        this.startTimeUpdate();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('citySearch');
        const searchBtn = document.getElementById('searchBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length >= 2) {
                    this.searchTimeout = setTimeout(() => {
                        this.searchCities(query);
                    }, 300);
                } else {
                    this.hideSuggestions();
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.loadWeatherData(query);
                        this.hideSuggestions();
                        e.target.blur();
                    }
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput) {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.loadWeatherData(query);
                        this.hideSuggestions();
                    }
                }
            });
        }

        // Click outside to hide suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });

        // Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getLocationWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log('Geolocation error:', error);
                }
            );
        }
    }

    async searchCities(query) {
        try {
            const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`);
            const cities = await response.json();
            this.displaySuggestions(cities);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    displaySuggestions(cities) {
        const suggestions = document.getElementById('searchSuggestions');
        
        if (!cities || cities.length === 0) {
            this.hideSuggestions();
            return;
        }

        if (!suggestions) return;

        suggestions.innerHTML = '';
        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <strong>${city.name}</strong>
                ${city.state ? `, ${city.state}` : ''}, ${city.country}
            `;
            item.addEventListener('click', () => {
                this.loadWeatherData(city.name);
                const input = document.getElementById('citySearch');
                if (input) input.value = city.name;
                this.hideSuggestions();
            });
            suggestions.appendChild(item);
        });

        suggestions.classList.add('show');
    }

    hideSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) {
            suggestions.classList.remove('show');
        }
    }

    async loadWeatherData(city) {
        this.showLoading();
        this.hideError();
        
        try {
            // Load current weather and forecast in parallel
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`/api/weather/current?city=${encodeURIComponent(city)}`),
                fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`)
            ]);

            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('City not found');
            }

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            this.currentCity = city;
            this.displayCurrentWeather(currentData);
            this.displayForecast(forecastData.forecast);
            this.displayHourlyForecast(forecastData.forecast);
            this.updateBackground(currentData.description);
            this.updateWeatherAnimation(currentData.description);
            
            this.hideLoading();
            this.showWeatherContent();

        } catch (error) {
            console.error('Weather data error:', error);
            this.hideLoading();
            this.showError(error.message);
        }
    }

    async getLocationWeather(lat, lon) {
        try {
            const response = await fetch(`/api/weather/current?lat=${lat}&lon=${lon}`);
            if (response.ok) {
                const data = await response.json();
                this.loadWeatherData(data.city);
            }
        } catch (error) {
            console.error('Location weather error:', error);
        }
    }

    displayCurrentWeather(data) {
        const currentCity = document.getElementById('currentCity');
        const currentCountry = document.getElementById('currentCountry');
        
        if (currentCity) currentCity.textContent = data.city;
        if (currentCountry) currentCountry.textContent = data.country;
        
        // Update weather icon
        const iconElement = document.getElementById('currentWeatherIcon');
        if (iconElement) {
            iconElement.src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
            iconElement.alt = data.description;
        }
        
        // Update temperature and description
        const currentTemp = document.getElementById('currentTemp');
        const feelsLike = document.getElementById('feelsLike');
        const currentDesc = document.getElementById('currentDescription');
        
        if (currentTemp) currentTemp.textContent = data.temperature;
        if (feelsLike) feelsLike.textContent = data.feels_like;
        if (currentDesc) currentDesc.textContent = data.description;
        
        // Update weather details
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('windSpeed');
        const pressure = document.getElementById('pressure');
        const visibility = document.getElementById('visibility');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        
        if (humidity) humidity.textContent = `${data.humidity}%`;
        if (windSpeed) windSpeed.textContent = `${Math.round(data.wind_speed * 3.6)} km/h`;
        if (pressure) pressure.textContent = `${data.pressure} hPa`;
        if (visibility) visibility.textContent = `${data.visibility} km`;
        if (sunrise) sunrise.textContent = data.sunrise;
        if (sunset) sunset.textContent = data.sunset;
    }

    displayForecast(forecastData) {
        const container = document.getElementById('forecastContainer');
        if (!container) return;
        container.innerHTML = '';

        // Group forecast by date and get daily summaries
        const dailyForecasts = this.groupForecastByDay(forecastData);
        
        dailyForecasts.slice(0, 5).forEach(day => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-date">${this.formatDate(day.date)}</div>
                <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" 
                     alt="${day.description}" class="forecast-icon">
                <div class="forecast-temps">
                    <span class="temp-high">${day.temp_max}°</span>
                    <span class="temp-low">${day.temp_min}°</span>
                </div>
                <div class="forecast-desc">${day.description}</div>
                <div class="forecast-details">
                    <div><i class="fas fa-tint"></i> ${day.humidity}%</div>
                    <div><i class="fas fa-wind"></i> ${Math.round(day.wind_speed * 3.6)} km/h</div>
                    <div><i class="fas fa-cloud-rain"></i> ${day.pop}%</div>
                </div>
            `;
            container.appendChild(forecastItem);
        });
    }

    displayHourlyForecast(forecastData) {
        const container = document.getElementById('hourlyForecastContainer');
        if (!container) return;
        container.innerHTML = '';

        // Show next 24 hours (8 * 3-hour intervals)
        forecastData.slice(0, 8).forEach(item => {
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.innerHTML = `
                <div class="hourly-time">${item.time}</div>
                <img src="https://openweathermap.org/img/wn/${item.icon}.png" 
                     alt="${item.description}" class="hourly-icon">
                <div class="hourly-temp">${item.temperature}°</div>
                <div class="hourly-desc">${item.description}</div>
            `;
            container.appendChild(hourlyItem);
        });
    }

    groupForecastByDay(forecastData) {
        const grouped = {};
        
        forecastData.forEach(item => {
            const date = item.date;
            if (!grouped[date]) {
                grouped[date] = {
                    date: date,
                    items: [],
                    temp_max: -Infinity,
                    temp_min: Infinity,
                    humidity: 0,
                    wind_speed: 0,
                    pop: 0,
                    descriptions: {}
                };
            }
            
            const day = grouped[date];
            day.items.push(item);
            day.temp_max = Math.max(day.temp_max, item.temp_max);
            day.temp_min = Math.min(day.temp_min, item.temp_min);
            day.humidity += item.humidity;
            day.wind_speed += item.wind_speed;
            day.pop = Math.max(day.pop, item.pop);
            
            // Count description occurrences
            day.descriptions[item.description] = (day.descriptions[item.description] || 0) + 1;
        });

        // Process grouped data
        return Object.values(grouped).map(day => {
            const itemCount = day.items.length;
            day.humidity = Math.round(day.humidity / itemCount);
            day.wind_speed = day.wind_speed / itemCount;
            
            // Get most common description and icon
            const mostCommonDesc = Object.keys(day.descriptions).reduce((a, b) => 
                day.descriptions[a] > day.descriptions[b] ? a : b
            );
            day.description = mostCommonDesc;
            
            // Get icon from the most common description
            const itemWithDesc = day.items.find(item => item.description === mostCommonDesc);
            day.icon = itemWithDesc ? itemWithDesc.icon : day.items[0].icon;
            
            return day;
        });
    }

    updateBackground(description) {
        const body = document.body;
        const desc = description.toLowerCase();
        
        // Remove existing weather classes
        body.classList.remove('weather-clear', 'weather-clouds', 'weather-rain', 'weather-snow', 'weather-thunderstorm');
        
        if (desc.includes('clear') || desc.includes('sunny')) {
            body.classList.add('weather-clear');
        } else if (desc.includes('cloud')) {
            body.classList.add('weather-clouds');
        } else if (desc.includes('rain') || desc.includes('drizzle')) {
            body.classList.add('weather-rain');
        } else if (desc.includes('snow')) {
            body.classList.add('weather-snow');
        } else if (desc.includes('thunder') || desc.includes('storm')) {
            body.classList.add('weather-thunderstorm');
        }
    }

    updateWeatherAnimation(description) {
        const rainContainer = document.querySelector('.rain-container');
        const desc = description.toLowerCase();
        
        if (rainContainer) {
            if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('storm')) {
                this.createRainAnimation();
                rainContainer.classList.add('active');
            } else {
                rainContainer.classList.remove('active');
                rainContainer.innerHTML = '';
            }
        }
    }

    createRainAnimation() {
        const rainContainer = document.querySelector('.rain-container');
        if (!rainContainer) return;
        rainContainer.innerHTML = '';
        
        for (let i = 0; i < 100; i++) {
            const rainDrop = document.createElement('div');
            rainDrop.className = 'rain-drop';
            rainDrop.style.left = Math.random() * 100 + '%';
            rainDrop.style.animationDelay = Math.random() * 1 + 's';
            rainDrop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            rainContainer.appendChild(rainDrop);
        }
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    startTimeUpdate() {
        setInterval(() => {
            this.updateCurrentTime();
        }, 60000); // Update every minute
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
    }

    showLoading() {
        const loading = document.getElementById('loadingSpinner');
        const weather = document.getElementById('weatherContent');
        const error = document.getElementById('errorMessage');
        if (loading) loading.classList.add('show');
        if (weather) weather.classList.remove('show');
        if (error) error.classList.remove('show');
    }

    hideLoading() {
        const loading = document.getElementById('loadingSpinner');
        if (loading) loading.classList.remove('show');
    }

    showWeatherContent() {
        const weather = document.getElementById('weatherContent');
        if (weather) weather.classList.add('show');
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        if (errorText) errorText.textContent = message || 'Something went wrong. Please try again.';
        if (errorElement) errorElement.classList.add('show');
        const weather = document.getElementById('weatherContent');
        if (weather) weather.classList.remove('show');
    }

    hideError() {
        const error = document.getElementById('errorMessage');
        if (error) error.classList.remove('show');
    }
}

// Initialize the weather app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Service Worker Registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add some utility functions for enhanced user experience
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) suggestions.classList.remove('show');
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

function handleGesture() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
        // Swipe left - could implement location switching
        console.log('Swiped left');
    }
    if (touchEndX > touchStartX + threshold) {
        // Swipe right - could implement location switching
        console.log('Swiped right');
    }
}

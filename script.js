 // API key for OpenWeatherMap
 const apiKey = '890e46698a754776cde4aa0480e3f0a4';
        
 // DOM elements
 const searchButton = document.getElementById('search-btn');
 const currentLocationButton = document.getElementById('current-location-btn');
 const cityInput = document.getElementById('city-input');
 const weatherInfo = document.getElementById('weather-info');
 const cityName = document.getElementById('city-name');
 const temperature = document.getElementById('temperature');
 const humidity = document.getElementById('humidity');
 const windSpeed = document.getElementById('wind-speed');
 const weatherIcon = document.getElementById('weather-icon');
 const errorMessage = document.getElementById('error-message');
 const forecastContainer = document.getElementById('forecast-container');
 const forecastSection = document.getElementById('forecast');

 // Event listener for search button
 searchButton.addEventListener('click', () => {
     const city = cityInput.value;
     if (city) {
         fetchWeather(city);
         fetchForecast(city);
     } else {
         showError('Please enter a city name');
     }
 });

 // Event listener for current location button
 currentLocationButton.addEventListener('click', () => {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(position => {
             const { latitude, longitude } = position.coords;
             fetchWeatherByCoordinates(latitude, longitude);
             fetchForecastByCoordinates(latitude, longitude);
         }, () => {
             showError('Unable to retrieve your location');
         });
     } else {
         showError('Geolocation is not supported by this browser');
     }
 });

 // Fetch current weather by city name
 async function fetchWeather(city) {
     try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
         if (!response.ok) throw new Error('City not found');
         const data = await response.json();
         updateUI(data);
     } catch (error) {
         showError(error.message);
     }
 }

 // Fetch current weather by coordinates
 async function fetchWeatherByCoordinates(lat, lon) {
     try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
         if (!response.ok) throw new Error('Weather data not found');
         const data = await response.json();
         updateUI(data);
     } catch (error) {
         showError(error.message);
     }
 }

 // Fetch 5-day forecast by city name
 async function fetchForecast(city) {
     try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
         if (!response.ok) throw new Error('Forecast not found');
         const data = await response.json();
         updateForecastUI(data);
     } catch (error) {
         showError(error.message);
     }
 }

 // Fetch 5-day forecast by coordinates
 async function fetchForecastByCoordinates(lat, lon) {
     try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
         if (!response.ok) throw new Error('Forecast not found');
         const data = await response.json();
         updateForecastUI(data);
     } catch (error) {
         showError(error.message);
     }
 }

 // Update UI with current weather data
 function updateUI(data) {
     cityName.textContent = data.name;
     temperature.textContent = `Temperature: ${data.main.temp} °C`;
     humidity.textContent = `Humidity: ${data.main.humidity}%`;
     windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
     weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
     weatherInfo.classList.remove('hidden');
     errorMessage.classList.add('hidden');
 }

 // Update UI with forecast data
 function updateForecastUI(data) {
     forecastContainer.innerHTML = ''; // Clear previous forecast
     const uniqueDates = new Set();
     data.list.forEach(item => {
         const date = new Date(item.dt * 1000).toLocaleDateString();
         if (!uniqueDates.has(date) && uniqueDates.size < 5) {
             uniqueDates.add(date);
             const forecastCard = document.createElement('div');
             forecastCard.className = 'bg-white p-4 rounded shadow';
             forecastCard.innerHTML = `
                 <h3 class="font-bold">${date}</h3>
                 <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather Icon">
                 <p>Temp: ${item.main.temp} °C</p>
                 <p>Humidity: ${item.main.humidity}%</p>
                 <p>Wind: ${item.wind.speed} m/s</p>
             `;
             forecastContainer.appendChild(forecastCard);
         }
     });
     forecastSection.classList.remove('hidden');
 }

 // Show error message
 function showError(message) {
     errorMessage.textContent = message;
     errorMessage.classList.remove('hidden');
     weatherInfo.classList.add('hidden');
     forecastSection.classList.add('hidden');
 }
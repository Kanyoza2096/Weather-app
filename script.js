const apiKey = "b503f09557ecb17afe53cc8ae4eee33b";  // Replace this with your actual API key
let isCelsius = true;

// Function to fetch weather data
async function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    localStorage.setItem("lastCity", city); // Save city in local storage
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);  // Log API response for debugging

        if (data.cod !== 200) {
            document.getElementById("weather-result").innerHTML = `<p style="color: red;">${data.message}</p>`;
            return;
        }

        document.getElementById("weather-result").innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
            <p id="temp">${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;

        getFiveDayForecast(city); // Fetch 5-day forecast
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("weather-result").innerHTML = `<p style="color: red;">Failed to load weather data.</p>`;
    }
}

// Fetch 5-day forecast
async function getFiveDayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);  // Log API response for debugging

        if (data.cod !== "200") {
            document.getElementById("weather-forecast").innerHTML = `<p style="color: red;">${data.message}</p>`;
            return;
        }

        let forecastHTML = `<h3>5-Day Forecast</h3>`;
        for (let i = 0; i < data.list.length; i += 8) {
            forecastHTML += `<p>${data.list[i].dt_txt.split(" ")[0]} - ${data.list[i].main.temp}°C, ${data.list[i].weather[0].description}</p>`;
        }

        document.getElementById("weather-forecast").innerHTML = forecastHTML;
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        document.getElementById("weather-forecast").innerHTML = `<p style="color: red;">Failed to load forecast data.</p>`;
    }
}

// Toggle temperature between Celsius and Fahrenheit
function toggleTemperature() {
    const tempElement = document.getElementById("temp");
    let tempValue = parseFloat(tempElement.innerText);

    if (isCelsius) {
        tempValue = (tempValue * 9/5) + 32;
        tempElement.innerText = `${tempValue.toFixed(2)}°F`;
    } else {
        tempValue = (tempValue - 32) * 5/9;
        tempElement.innerText = `${tempValue.toFixed(2)}°C`;
    }

    isCelsius = !isCelsius;
}

// Get user's location and fetch weather
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);  // Log API response for debugging

                if (data.cod !== 200) {
                    document.getElementById("weather-result").innerHTML = `<p style="color: red;">${data.message}</p>`;
                    return;
                }

                document.getElementById("weather-result").innerHTML = `
                    <h3>${data.name}, ${data.sys.country}</h3>
                    <p id="temp">${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                `;
            } catch (error) {
                console.error("Error fetching data:", error);
                document.getElementById("weather-result").innerHTML = `<p style="color: red;">Failed to load location data.</p>`;
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Load last searched city on page load
window.onload = function () {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        document.getElementById("city").value = lastCity;
        getWeather();
    }
};
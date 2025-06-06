import "./styles.css"

const weatherIconsDirectory = require.context('./images/weather-icons', false, /\.svg$/);
let isFahrenheit = true;

// FUNCTIONS
async function getWeatherData(city) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=us&key=979A9ED9G6FF9SL5ZR5U5PUSQ&contentType=json`, {mode:"cors"});
    const jsonData = await response.json();
    console.log(jsonData);

    return jsonData;
}

async function displayWeatherData(city) {
    try {
        const data = await getWeatherData(city);

        const weatherOverviewHeader = document.querySelector(".weather-overview-header");
        weatherOverviewHeader.innerHTML = `
            <div class="date-time">
                <h2>${formatDate(data.days[0].datetime)}</h2>
                <h2>As of ${formatTime(data.currentConditions.datetime)}</h2>
            </div>

            <h2>${data.resolvedAddress}</h2>
        `;

        const weatherIcon = document.querySelector(".weather-icon");
        const weatherIconPath = weatherIconsDirectory(`./${data.currentConditions.icon}.svg`);
        weatherIcon.innerHTML = `
            <img src="${weatherIconPath}" alt="weather-icon">
        `;

        const weatherOverviewFooter = document.querySelector(".weather-overview-footer");
        weatherOverviewFooter.innerHTML = `
            <h1 class="temp-value" data-temp-f="${data.currentConditions.temp}°F" data-temp-c="${fahrenheitToCelsius(data.currentConditions.temp)}°C">${formatTemperature(data.currentConditions.temp)}</h1>
            <h3>${data.currentConditions.conditions}</h3>
        `;

        const weatherInfo = document.querySelector(".weather-info");
        weatherInfo.innerHTML = `
            <h2>Today's Weather</h2>

            <div class="item">
                <p>Sunrise</p>
                <p>${formatTime(data.currentConditions.sunrise)}</p>
            </div>

            <div class="item">
                <p>Sunset</p>
                <p>${formatTime(data.currentConditions.sunset)}</p>
            </div>

            <div class="item">
                <p>Humidity</p>
                <p>${data.currentConditions.humidity}%</p>
            </div>

            <div class="item">
                <p>Wind Speed</p>
                <p>${data.currentConditions.windspeed} mph</p>
            </div>

            <div class="item">
                <p>UV Index</p>
                <p>${data.currentConditions.uvindex}</p>
            </div>
        `;

        const forecastGrid = document.querySelector(".forecast-grid");
        forecastGrid.innerHTML = "";
        for (let i = 1; i <= 10; i++) {
            forecastGrid.innerHTML += `
                <div class="forecast-item">
                    <h4>${formatDate(data.days[i].datetime)}</h4>
                    <img src="${weatherIconsDirectory(`./${data.days[i].icon}.svg`)}">
                    <p>${data.days[i].conditions}</p>
                    <p class="temp-value" data-temp-f="${data.days[i].temp}°F" data-temp-c="${fahrenheitToCelsius(data.days[i].temp)}°C">${formatTemperature(data.days[i].temp)}</p>
                </div>
            `;
        }
    }
    catch(e) {
        alert("Failed to retrieve weather data. Please try again." + e);
    }
}

function formatTemperature(temp) {
    if (isFahrenheit) {
        return `${temp}°F` 
    }
    else {
        return `${((temp - 32) * 5 / 9).toFixed(1)}°C`
    }
}

function fahrenheitToCelsius(temp) {
    return ((temp - 32) * 5 / 9).toFixed(1);
}

function formatDate(dateInput) {
    const date = new Date(dateInput);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function formatTime(timeInput) {
    let [hour, minute] = timeInput.split(":");
    const period = (hour >= 12 && hour != 24) ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
}

// DOM
const searchCityBtn = document.getElementById("search-city-btn");
searchCityBtn.addEventListener("click", () => {
    const cityInput = document.getElementById("city-input").value.trim();
    
    if (cityInput) {
        displayWeatherData(cityInput);
    }
    else {
        alert("Please enter a city.");
    }
});

const fahrenheitBtn = document.querySelector(".fahrenheit-btn");
const celsiusBtn = document.querySelector(".celsius-btn");
fahrenheitBtn.addEventListener("click", () => {
    if (isFahrenheit) {
        return;
    }
    else {
        isFahrenheit = true;
        celsiusBtn.classList.toggle("active");
        fahrenheitBtn.classList.toggle("active");
        const tempValue = document.querySelectorAll(".temp-value");
        tempValue.forEach(element => {
            element.textContent = `${element.dataset.tempF}`
        });
    }
});

celsiusBtn.addEventListener("click", () => {
    if (!isFahrenheit) {
        return;
    }
    else {
        isFahrenheit = false;
        celsiusBtn.classList.toggle("active");
        fahrenheitBtn.classList.toggle("active");
        const tempValue = document.querySelectorAll(".temp-value");
        tempValue.forEach(element => {
            element.textContent = `${element.dataset.tempC}`
        });
    }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    displayWeatherData("London");
});
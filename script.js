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
        const cityInfo = document.querySelector(".city-info");
        const temperatureInfo = document.querySelector(".temperature-info");

        cityInfo.textContent = data.resolvedAddress;
        temperatureInfo.textContent = `${data.currentConditions.temp}°F`;
    }
    catch {
        alert("Failed to retrieve weather data. Please try again.");
    }
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

// Initialize
// displayWeatherData("London");
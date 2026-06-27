const timeZones = {
  IN: "Asia/Kolkata",
  US: "America/New_York",
  GB: "Europe/London",
  JP: "Asia/Tokyo",
  AU: "Australia/Sydney",
  CA: "America/Toronto",
  FR: "Europe/Paris",
  DE: "Europe/Berlin",
};

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const weatherDiv = document.getElementById("weather");

  if (city === "") {
    weatherDiv.innerHTML =
      "<p style='color:red;'>Please enter a city name.</p>";
    return;
  }

  const apiKey = "34d41ef370a4634dd60e8d9d216b2480";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    weatherDiv.innerHTML = "<h3>Loading...</h3>";

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const icon = data.weather[0].icon;

    // Get the correct time zone based on country
    const timeZone = timeZones[data.sys.country] || "UTC";

    // Display the local date and time of the searched location
    const dateTime = new Intl.DateTimeFormat("en-IN", {
      timeZone: timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date());

    // Sunrise and Sunset
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();

    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    weatherDiv.innerHTML = `

        <h2>${data.name}, ${data.sys.country}</h2>

      <img
class="weather-icon"
src="https://openweathermap.org/img/wn/${icon}@4x.png"
alt="Weather Icon">

        <div class="date">📅 ${dateTime}</div>

        <div class="weather-grid">

            <div class="card">
                <h3>🌡 Temperature</h3>
                <p>${data.main.temp} °C</p>
            </div>

            <div class="card">
                <h3>🤗 Feels Like</h3>
                <p>${data.main.feels_like} °C</p>
            </div>

            <div class="card">
                <h3>💧 Humidity</h3>
                <p>${data.main.humidity}%</p>
            </div>

            <div class="card">
                <h3>🌬 Wind Speed</h3>
                <p>${data.wind.speed} m/s</p>
            </div>

            <div class="card">
                <h3>🌡 Pressure</h3>
                <p>${data.main.pressure} hPa</p>
            </div>

            <div class="card">
                <h3>👀 Visibility</h3>
                <p>${data.visibility / 1000} km</p>
            </div>

            <div class="card">
                <h3>☁ Weather</h3>
                <p>${data.weather[0].description}</p>
            </div>

            <div class="card">
                <h3>🌅 Sunrise / 🌇 Sunset</h3>
                <p>Sunrise: ${sunrise}</p>
                <p>Sunset: ${sunset}</p>
            </div>

        </div>

        `;
  } catch (error) {
    weatherDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

document.getElementById("city").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

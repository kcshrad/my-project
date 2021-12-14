function formatDate(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let year = now.getFullYear();
  let date = now.getDate();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  return `${hours}:${minutes} <br/>${day} ${date}, ${month} ${year}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` <div class="row">
        <div class="col-12">
          <div class="week">${formatDay(forecastDay.dt)}</div>
          <img
            src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="42"
          />
          <div class="weather-forecast-temp">
            <span class="weather-forecast-temp-min">${Math.round(
              forecastDay.temp.min
            )}°C</span>
            <span class="weather-forecast-temp-max">${Math.round(
              forecastDay.temp.max
            )}°C</span>
          </div>
        </div>
      
    
  </div>
  `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "409c92218249e96f0e8de22a43f0bc4b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}
function showTemperature(response) {
  console.log(response);
  document.querySelector("#current-city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector(".currentTemp").innerHTML = `${Math.round(
    celsiusTemperature
  )}°C`;

  let weatherType = response.data.weather[0].main;
  let newweather = document.querySelector(".description");
  newweather.innerHTML = weatherType;

  let humidity = document.querySelector("#humidity");
  let newHumidity = response.data.main.humidity;
  humidity.innerHTML = `Humidity ${newHumidity}%`;

  let pressure = document.querySelector("#pressure");
  let newPressure = response.data.main.pressure;
  pressure.innerHTML = ` Pressure ${newPressure}`;

  let timeElement = document.querySelector("#time");
  timeElement.innerHTML = formatDate(response.data.dt * 1000);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function search(searchInput) {
  let apiKey = "409c92218249e96f0e8de22a43f0bc4b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function searchCurrent(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city").value;
  //let cityInput = document.querySelector("#current-city");
  //cityInput.innerHTML = `${searchInput.value}`;
  //let apiKey = "409c92218249e96f0e8de22a43f0bc4b";
  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=metric`;

  search(searchInput);
}
function showFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(".currentTemp");
  fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  currentTemp.innerHTML = `${Math.round(fahrenheitTemperature)}°F`;
}
let celsiusTemperature = null;

function showCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(".currentTemp");
  currentTemp.innerHTML = `${Math.round(celsiusTemperature)}°C`;
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchCurrent);

let fahrenheitButton = document.querySelector(".fahrenheit");
fahrenheitButton.addEventListener("click", showFahrenheit);

let celsiusButton = document.querySelector(".celsius");
celsiusButton.addEventListener("click", showCelsius);

search("New York");

function currentLocationTemperature(response) {
  //let temperature = Math.round(response.data.main.temp);
  let button = document.querySelector("#current-location");
  button.addEventListener("click", getCurrentLocationTemperature);

  function getCurrentLocationTemperature(event) {
    event.preventDefault();
    let city = response.data.name;
    let newCurrentTemp = document.querySelector(".currentTemp");
    newCurrentTemp.innerHTML = `${Math.round(response.data.main.temp)}°C`;
    let h2 = document.querySelector("#current-city");
    h2.innerHTML = city;

    let weatherType = response.data.weather[0].main;
    let newweather = document.querySelector(".description");
    newweather.innerHTML = weatherType;

    let humidity = document.querySelector("#humidity");
    let newHumidity = response.data.main.humidity;
    humidity.innerHTML = `Humidity ${newHumidity}%`;

    let pressure = document.querySelector("#pressure");
    let newPressure = response.data.main.pressure;
    pressure.innerHTML = ` Pressure ${newPressure}`;
  }
}
function showLocation(position) {
  let apiKey = "409c92218249e96f0e8de22a43f0bc4b";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(currentLocationTemperature);
}
navigator.geolocation.getCurrentPosition(showLocation);

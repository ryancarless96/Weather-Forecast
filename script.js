var searchHistory = [];
var locQueryUrl = 'https://api.openweathermap.org/';
var APIKey = "86abf9206ebd8e4acd85fa659421b764";
var query

var searchFormEl = document.querySelector('#search-form');
var searchInputVal = document.getElementById("#search-input-val");
var resultTextEl = document.querySelector('#result-text');
var resultAnswersEl = document.querySelector('#result-answer');
var dailyForecast = document.getElementById("#dailyForecast");
var searchingContainter = document.querySelector('#history');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderSearchHistory() {
  searchingContainter.innerHTML = '';

  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'weather forecast');
    btn.setAttribute('history-btn', 'btn-history');

    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchingContainter.append(btn);
  }
}

function appendToHistory(search) {
  if (searchHistory.indexOf(search) === -1) {
    return;
  }
  searchHistory.push(search);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  renderSearchHistory();

}

function initSearchHistory() {
  var storedHistory = localStorage.getItem('searchHistory');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

function renderNewWeather(city, weather) {
  var currentDate = dayjs().format('M/D/YYYY')
  var temperatureEl = weather.main.temp;
  var windPower = weather.wind.speed;
  var humidity = weather.main.humidity;
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid==86abf9206ebd8e4acd85fa659421b764`;
  var iconDesc = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherImg = document.createElement('img');
  var temperatureEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');


  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  heading.setAttribute('class', 'h3 card-title');
  temperatureEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  heading.textContent = city.name + ' (' + currentDate + ')';
  weatherImg.setAttribute('src', locQueryUrl);
  weatherImg.setAttribute('alt', iconDesc);
  heading.append(weatherImg);
  temperatureEl.textContent = `TemperatureEl: ${temperatureEl}°F`;
  windEl.textContent = `wind: ${windPower} MPH`;
  humidityEl.textContent = `Humidity:${humidity} '%`;
  cardBody.append(heading,temperatureEl, windEl, humidityEl);

  forecastContainer.innerHTML='';
  forecastContainer.append(card);
}

function renderForecastCard(dailyForecast) {
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=86abf9206ebd8e4acd85fa659421b764`;
  var iconDesc = dailyForecast.weather[0].description || dailyForecast[0].main;
  var temperatureEl = dailyForecast.main.temp;
  var windPower = dailyForecast.wind.speed;

  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h3');
  var weatherImg = document.createElement('img');
  var temperatureEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');


  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherImg, temperatureEl, windEl, humidityEl);


  col.setAttribute('class', 'col');
  col.classList.add('col-2');
  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  cardTitle.setAttribute('class', 'card-title');
  temperatureEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');


  cardTitle.textContent = dayjs(dailyForecast.dt_txt).format('M/D/YYYY');
  weatherImg.setAttribute('src', locQueryUrl);
  weatherImg.setAttribute('alt', iconDesc);
  temperatureEl.textContent = `TemperatureEl: ${temperatureEl}°F`;
  windEl.textContent = `wind: ${windPower} MPH`;
  humidityEl.textContent = `Humidity:${humidityEl} '%`;


  forecastContainer.append(col);
}



function renderForecast(dailyForecast) {
  var startDate = dayjs().add(1, 'day').format('M/D/YYYY');
  var endDate = dayjs().add(5, 'day').format('M/D/YYYY');

  var headingColumn = document.createElement('div');
  var heading = document.createElement('h2');

  headingColumn.setAttribute('class', 'col');
  heading.textContent = '5-Day Forecast:';
  headingColumn.append(heading);

  forecastContainer.innerHTML = '';
  forecastContainer.append(headingColumn);

  for (var i = 0; i < weather.list.length; i++) {
    if (dailyForecast[i].dt >= startDate && dailyForecast[i].dt <= endDate) {

      if (dailyForecast[i].dt_txt.slice(11, 13) === '12') {
        renderForecastCard(dailyForecast[i], city);
      }
    }
  }
}

function renderItems(city, data) {
  renderCurrentWeather(city, weather);
  renderForecast(data.list);
}

function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;

  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=86abf9206ebd8e4acd85fa659421b764`;

  fetch(apiUrl)
    .then(function () {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });


}


function fetchCoords(search) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=86abf9206ebd8e4acd85fa659421b764`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if(!data[0]) {
        alert('No results found. Please try again.');
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
}
    })
    .catch(function (err) {
      console.error(err);
    });

}
function handleSearchFormSubmit(event) {
 if(!searchInputVal.value) {
  return;
 }
 event.preventDefault();
var search = searchInputVal.value.trim();
fetchCoords(search);
searchInputVal.value = '';
}

function handleSearchHistoryClick(event) {
  if(!event.target.matches('.btn-history')) {
    return;
  }

  var btn = event.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}
initSearchHistory();
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
searchingContainter.addEventListener('click', handleSearchHistoryClick);

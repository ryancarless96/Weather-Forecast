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
  if(storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

function renderNewWeather(city, weather) {
  var currentDate = dayjs().format('M/D/YYYY')
  var temperature = weather.main.temp;
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
  weatherImg.setAttribute('src', 'https://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
  weatherImg.setAttribute('alt', iconDesc);
  heading.append(weatherImg);
  temperatureEl.textContent = 'Temperature: ' + temperature + ' °F';
  windEl.textContent = 'Wind Speed: ' + windPower + ' MPH';
  humidityEl.textContent = 'Humidity: ' + humidity + '%';

  forecastContainer.append(card);
}

function renderForecast(city, weather) {
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
    .then(function (response) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
  function fetchCoords(search) {
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=86abf9206ebd8e4acd85fa659421b764`;


    fetch(apiUrl)
      .then(function (response) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('No results found');
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
    if (!searchInputVal.value) {
      return;
    }
    event.preventDefault();
    var search = searchInputVal.trim();
    fetchCoords(search);
    searchInputVal.value = '';
  }

  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);

}
initSearchHistory();
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
searchingContainter.addEventListener('click', handleSearchHistoryClick);

var searchHistory =[];
var locQueryUrl = 'https://api.openweathermap.org/';
var APIKey = "86abf9206ebd8e4acd85fa659421b764";
var query

var searchFormEl = document.querySelector('#search-form');
var searchInputVal = document.getElementById("search-input-val");
var resultTextEl = document.querySelector('#result-text');
var resultAnswersEl = document.querySelector('#result-answer');
var dailyForecast = document.getElementById("dailyForecast");
var searchingContainter = document.querySelector('#history');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderSearchHistory(){
  searchingContainter.innerHTML = '';

  for(var i = searchHistory.length -1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type','button');
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

function renderNewWeather(city,weather) {
  var currentDate = dayjs().format('M/D/YYYY')
  var temperature = weather.main.temp;
  var windPower = weather.wind.speed;
  var humidity = weather.main.humidity;
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid==86abf9206ebd8e4acd85fa659421b764`;
  var iconDesc = weather.weather[0].description || weather[0].main;
  
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  
  if (function (search) {
    locQueryUrl = "https://api.openweathermap.org/" + searchInputVal + "&appid=" + '86abf9206ebd8e4acd85fa659421b764';
  })

    locQueryUrl = locQueryUrl + '&q=' + query;
  //http://api.openweathermap.org/geo/1.0/direct?q=piscataway,NJ,US&limit=1&appid=86abf9206ebd8e4acd85fa659421b764
 
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=86abf9206ebd8e4acd85fa659421b764`,)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        return response.json();
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
 
      if (!city.results.length) {
        console.log('No results found!');
        resultAnswersEl.textContent = '';
        for (var i = 0; i < city.results.length; i++) {
          printResults(city.results[i]);
        }
      }
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=86abf9206ebd8e4acd85fa659421b764`,)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
    })
};
function handleSearchFormSubmit(event) {
  event.preventDefault();
 
  var searchInputVal = document.querySelector('#search-input').value;
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  fetchCoords(searchInputVal);
}
 
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
 
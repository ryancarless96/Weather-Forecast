var searchHistory =[];
var weatherURL ='https://api.openweathermap.org/';
var APIKey = "86abf9206ebd8e4acd85fa659421b764";

var searchFormEl = document.querySelector('#search-form');
var searchInputVal = document.getElementById("search-input-val");
var resultTextEl = document.querySelector('#result-text');
var resultAnswersEl = document.querySelector('#result-answer');
var dailyForecast = document.getElementById("dailyForecast");

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);


function searchforQuery() {
  searchHistoryContainer.innerHTML='';
  
  console.log(resultObj);
  var query = searchInputVal[0].split('=').pop();
  searchFormEl(query);

  var resultWork = document.createElement('div');
  resultWork.classList.add('work', 'bg-light', 'text-dark', 'mb-3', 'p-3');


  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultWork.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.title;

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Subjects:</strong>' + resultObj.date + '<br/>';

  if (resultObj.subject) {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong>' + resultObj.subject.join(',') + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong> Description: </strong>' + resultObj.description[0];
  }
  if (resultObj.description) {
    bodyContentEl.innerHTML +=
      '<strong> Description: </strong>' + resultObj.description[0];
  } else {
    bodyContentEl.innerHTML +=
      '<strong> Description: </strong> No description for this entry.';
  }
  var linkButtonEl = document.createElement('a');
  linkButtonEl.textContent = 'Read More';
  linkButtonEl.setAttribute('href', resultObj.url)
  linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl, linkButtonEl);
  resultAnswersEl.append(resultWork);
}

function searchApi() {
  var{lat}=location;
  var{lon}=location;
  var city=location.name;
  var locQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=86abf9206ebd8e4acd85fa659421b764`;
  if (function (search) {
    locQueryUrl = "https://api.openweathermap.org/" + searchInputVal + "&appid=" + '86abf9206ebd8e4acd85fa659421b764';
  })

  locQueryUrl = locQueryUrl + '&q=' + query;
  //http://api.openweathermap.org/geo/1.0/direct?q=piscataway,NJ,US&limit=1&appid=86abf9206ebd8e4acd85fa659421b764

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=86abf9206ebd8e4acd85fa659421b764`,)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then
        throw response.json();
      }
      return response.json();
    })
    .then(function (locRes) {
      resultTextEl.textContent = locRes.search.query;
      console.log(locRes);

      if (!locRes.results.length) {
        console.log('No results found!');
        resultAnswersEl.textContent = '';
        for (var i = 0; i < locRes.results.length; i++) {
          printResults(locRes.results[i]);
        }
      }
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=86abf9206ebd8e4acd85fa659421b764`,)
    .then(function(response){
      if(response) {
        throw response.json();
      }
      return response.json();
    })
    

    })
    .catch(function (error) {
      console.error(error);
    });
}
function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  searchApi(searchInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);



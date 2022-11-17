var resultTextEl = document.querySelector('#result-text');
var resultAnswersEl = document.querySelector('#result-answer');
var searchFormEl = document.querySelector('#search-form');

function getParams() {
  var searchParamsArr = document.location.search.split('&');

  var query = searchParamsArr[0].split('=').pop();
  var format = searchParamsArr[1].split('=').pop();

  searchApi(query, format);

}
function printResults(resultObj) {
  console.log(resultObj);

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
function searchApi(query, format) {
  var locQueryUrl = 'https://openweathermap.org/forecast5';
  if(format) {
    locQueryUrl = 'https://www.openweathermap.org/' + format + '/?fo=json';
  }
  locQueryUrl = locQueryUrl + '&q=' + query;

  fetch(locQueryUrl)
  .then(function(response) {
    if(!response.ok) {
      throw response.json();
    }
    return response.json();
  })
  .then(function(locRes){
    resultTextEl.textContent = locRes.search.query;
    console.log(locRes);

    if(!locRes.results.length) {
      console.log('No results found!');
      resultAnswersEl.textContent = '';
      for(var i=0; i < locRes.results.length; i++) {
        printResults(locRes.results[i]);
      }
    }
  })
  .catch(function(error){
    console.error(error);
  });
}
function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;
  var formatInputVal = document.querySelector('#format-input').value;
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  var queryString = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  location.assign(queryString);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

getParams();


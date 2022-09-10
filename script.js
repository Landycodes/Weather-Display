//weather box
var currentCity = document.getElementById('currentcity');
var currentDate = document.getElementById('currentdate');
var mainIcon = document.getElementById('boxicon')
var Temp = document.getElementById('Temp');
var Wind = document.getElementById('Wind');
var Humid = document.getElementById('Humid');
var colorIndex = document.getElementById('colorIndex');
var UVIndex = document.getElementById('UVindex');


//side menu
var menuBtn = document.getElementById('menu');
var menuList = document.getElementById('menu-list');
var citySearchInput = document.getElementById('citysearch');
var stateSearchInput = document.getElementById('statesearch');
var searchBtn = document.getElementById('searchicon')
var addBtn = document.getElementById('addcitybtn');
var cityList = document.getElementById('citylist');
var deleteBtn = document.querySelector('.deleteBtn');

//5day forecast
var dayOne = document.getElementById('day1');//first day
var iconOne = document.getElementById('icon1');
var tempOne = document.getElementById('temp1');
var windOne = document.getElementById('wind1');
var humidOne = document.getElementById('humid1')
var dayTwo = document.getElementById('day2');//second day
var iconTwo = document.getElementById('icon2');
var tempTwo = document.getElementById('temp2');
var windTwo = document.getElementById('wind2');
var humidTwo = document.getElementById('humid2')
var dayThree = document.getElementById('day3');//third day
var iconThree = document.getElementById('icon3');
var tempThree = document.getElementById('temp3');
var windThree = document.getElementById('wind3');
var humidThree = document.getElementById('humid3')
var dayFour = document.getElementById('day4');//fourth day
var iconFour = document.getElementById('icon4');
var tempFour = document.getElementById('temp4');
var windFour = document.getElementById('wind4');
var humidFour = document.getElementById('humid4')
var dayFive = document.getElementById('day5');//fifth day
var iconFive = document.getElementById('icon5');
var tempFive = document.getElementById('temp5');
var windFive = document.getElementById('wind5');
var humidFive = document.getElementById('humid5')

var savedCityIndex = localStorage.getItem('city index');
var storArr = JSON.parse(localStorage.getItem('storArr'));

var click = 0;
var city;
var state;

if (storArr === null) {
    storArr = [];
}


//opens and closes side menu
menuBtn.addEventListener('click', function() {
    if (click === 0) {
        savedValues();
    } click ++
    if (menuList.classList.contains('hide')) {
        menuList.classList.remove('hide');
    } else {
        menuList.classList.add('hide')
    }
});

//on click take city and state value and ask api to return information on that location
searchBtn.addEventListener('click', function() {
    if (citySearchInput.value === '' || stateSearchInput.value === '') {
        window.alert('please fill out both city and state try again')
        return
    } else if (savedCityIndex >= 6){
        return
    } else { 
        localStorage.setItem('current city', citySearchInput.value);
        localStorage.setItem('current state', stateSearchInput.value);
        localStorage.setItem('city index', savedCityIndex);
        city = localStorage.getItem('current city');
        state = localStorage.getItem('current state');
        addItem();
        save();
        weatherSearch();
    }
});


function addItem(cityInput, stateInput) {
    var cityBox = document.createElement('div');
    var deleteBtn = document.createElement('span');
    deleteBtn.innerText = 'X';
    cityBox.classList.add('citybox');
    deleteBtn.classList.add('deleteBtn');
    if (cityInput === undefined || stateInput === undefined) {
    cityInput = citySearchInput.value;
    stateInput = stateSearchInput.value;
    }
    cityBox.textContent = cityInput + ', ' + stateInput; 
    cityList.appendChild(cityBox);
    cityBox.appendChild(deleteBtn);
    citySearchInput.value = '';
    stateSearchInput.value = '';

    //button to go to a saved location
    cityBox.addEventListener('click', function() {
        cityBox.removeChild(deleteBtn);
        boxArr = cityBox.innerText.split(',');
        city = localStorage.setItem('current city', boxArr[0]);
        state = localStorage.setItem('current state', boxArr[1]);
        weatherSearch();
       cityBox.appendChild(deleteBtn)
    });

    //delete button
    deleteBtn.addEventListener('click', function() {
        cityList.removeChild(cityBox);
        savedCityIndex--;
        localStorage.setItem('city index', savedCityIndex);
        savedArr = JSON.parse(localStorage.getItem('storArr').replace(/ /g, ''))
        for (let i = 0; i < savedArr.length; i++) {
            if (savedCityIndex <= 0) {
                return
            } else if (cityBox.textContent.replace('X', '').replace(/ /g, '') == savedArr[i]) {
                localStorage.removeItem('city ' + (i + 1).toString())
                localStorage.removeItem('storArr');
                localStorage.setItem('storArr', JSON.stringify(savedArr[i])) 
                console.log(savedArr.length)  
            }
        }   

    });
};

//saves each input and stores inputs into an array
function save() {
    var cityBox = document.querySelectorAll('.citybox')
    savedCityIndex++;
    for (let i = 0; i < cityBox.length; i++) {
        localStorage.setItem('city ' + savedCityIndex, cityBox[i].innerText.replace('X', ''));
        localStorage.setItem('city index', savedCityIndex);
    }
    storArr.push(localStorage.getItem('city ' + savedCityIndex));
    localStorage.setItem('storArr', JSON.stringify(storArr));

}

//gets stored box values
function savedValues() {//
    if (localStorage.getItem('storArr') === null) {
        return
    }
    var savedItems = JSON.parse(localStorage.getItem('storArr'));
    for (let i = 0; i < savedItems.length; i++) {
        if (savedItems[i] === null) {
            return
        }
        splitItems = savedItems[i].split(',');
        cityInput = splitItems[0];
        stateInput = splitItems[1];
        addItem(cityInput, stateInput);
    }

}

//displays last location input
if (localStorage.getItem('current city') != null && localStorage.getItem('current state') != null) {
    weatherSearch();
}

function weatherSearch() {
    city = localStorage.getItem('current city');
    state = localStorage.getItem('current state');
   fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city +',' + state +',us&limit=1&appid=195c4d43c50449f776aa4216da66c55a')
    .then(function (response) { 
        if (!response.ok) {
         window.alert('Something went wrong. please try again later')
        } else { 
        return response.json()
        }
    })
    .then(function (location) {//takes search input, retrieves info
        location = location[0];
        //console.log(location);
        if (location === undefined) {
            window.alert('please fill in a valid city and state');
            return
            }
        currentCity.innerText = location.name + ', ' + location.state;
        var latCord = location.lat;
        var lonCord = location.lon;
        fetch('https://api.openweathermap.org/data/3.0/onecall?lat='+latCord+'&lon='+lonCord+'&exclude=minutely,hourly&appid=195c4d43c50449f776aa4216da66c55a&units=imperial')
        .then(function(response) {
           return response.json()
        })
        .then(function (weatherData) {//takes info and displays on page
            //console.log(weatherData);
            //weatherbox date
            var todayDate = new Date(weatherData.current.dt * 1000);
            var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            var today = week[todayDate.getDay()];
            var month = todayDate.getMonth() + 1;
            var date = todayDate.getDate();
            var year= todayDate.getFullYear();
            currentDate.textContent = today + ', ' + month + '/' + date + '/' + year;
            //weatherbox weather conditions
            Temp.textContent ='Temp: ' + Math.round(weatherData.current.temp) + '°F';
            Wind.textContent = 'Wind: ' + Math.round(weatherData.current.wind_speed) + 'Mph';
            Humid.textContent = 'Humidity: ' + weatherData.current.humidity + '%';
            uvValue = Math.round(weatherData.current.uvi)
                if (uvValue <= 2) {
                    colorIndex.setAttribute('style', 'background-color: green;');
                } else if (uvValue >= 3 && uvValue <= 5) {
                    colorIndex.setAttribute('style', 'background-color: yellow;');
                } else if (uvValue >= 6 && uvValue <= 7) {
                    colorIndex.setAttribute('style', 'background-color: orange;');
                } else if (uvValue >= 8 && uvValue <= 10) {
                    colorIndex.setAttribute('style', 'background-color: red;');
                }
                colorIndex.textContent = Math.round(weatherData.current.uvi);
                UVIndex.textContent = 'UV index: ';
                UVIndex.appendChild(colorIndex);

            mainIcon.src = 'http://openweathermap.org/img/wn/'+ weatherData.current.weather[0].icon +'@2x.png';
            //5day forecast dates
            var dayDateOne = new Date(weatherData.daily[1].dt * 1000);
            dayOne.textContent = week[dayDateOne.getDay()];
            var dayDateTwo = new Date(weatherData.daily[2].dt * 1000);
            dayTwo.textContent = week[dayDateTwo.getDay()];
            var dayDateThree = new Date(weatherData.daily[3].dt * 1000);
            dayThree.textContent = week[dayDateThree.getDay()];
            var dayDateFour = new Date(weatherData.daily[4].dt * 1000);
            dayFour.textContent = week[dayDateFour.getDay()];
            var dayDateFive = new Date(weatherData.daily[5].dt * 1000);
            dayFive.textContent = week[dayDateFive.getDay()];
            //5day icons
            iconOne.src = 'http://openweathermap.org/img/wn/'+ weatherData.daily[0].weather[0].icon +'.png';
            iconTwo.src = 'http://openweathermap.org/img/wn/'+ weatherData.daily[1].weather[0].icon +'.png';
            iconThree.src = 'http://openweathermap.org/img/wn/'+ weatherData.daily[2].weather[0].icon +'.png';
            iconFour.src = 'http://openweathermap.org/img/wn/'+ weatherData.daily[3].weather[0].icon +'.png';
            iconFive.src = 'http://openweathermap.org/img/wn/'+ weatherData.daily[4].weather[0].icon +'.png';
            //5day temp and wind
            tempOne.textContent = 'Temp: ' + Math.round(weatherData.daily[0].temp.day) + '°F';
            windOne.textContent = 'Wind: ' + Math.round(weatherData.daily[0].wind_speed) + 'Mph';
            humidOne.textContent = 'Humidity: ' + weatherData.daily[0].humidity + '%';
            tempTwo.textContent = 'Temp: ' + Math.round(weatherData.daily[1].temp.day) + '°F';
            windTwo.textContent = 'Wind: ' + Math.round(weatherData.daily[1].wind_speed) + 'Mph';
            humidTwo.textContent = 'Humidity: ' + weatherData.daily[1].humidity + '%';
            tempThree.textContent = 'Temp: ' + Math.round(weatherData.daily[2].temp.day) + '°F';
            windThree.textContent = 'Wind: ' + Math.round(weatherData.daily[2].wind_speed) + 'Mph';
            humidThree.textContent = 'Humidity: ' + weatherData.daily[2].humidity + '%';
            tempFour.textContent = 'Temp: ' + Math.round(weatherData.daily[3].temp.day) + '°F';
            windFour.textContent = 'Wind: ' + Math.round(weatherData.daily[3].wind_speed) + 'Mph';
            humidFour.textContent = 'Humidity: ' + weatherData.daily[3].humidity + '%';
            tempFive.textContent = 'Temp: ' + Math.round(weatherData.daily[4].temp.day) + '°F';
            windFive.textContent = 'Wind: ' + Math.round(weatherData.daily[4].wind_speed) + 'Mph';
            humidFive.textContent = 'Humidity: ' + weatherData.daily[4].humidity + '%';
        })
    });
};



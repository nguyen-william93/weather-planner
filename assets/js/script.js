
var displayCurrentWeather = function(temp, wind_speed, humidity,uvi){
    console.log(temp, wind_speed, humidity, uvi);
    
};

var display5Day = function (temp, wind_speed, humidity, icon){
    console.log(temp, wind_speed, humidity, icon);
};

var getWeather = function(lon, lat){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=9698d78e4b0b91d10c1cae15ee7197eb"

    var response = fetch(apiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                displayCurrentWeather(data.current.temp, data.current.wind_speed, data.current.humidity,data.current.uvi);
                for (var i = 0; i < data.daily.length; i++){
                    display5Day(data.daily[i].temp.day,data.daily[i].wind_speed, data.daily[i].humidity, data.daily[i].weather[0].icon);
                }
            })
        }
    })
};

var getLatLon = function(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9698d78e4b0b91d10c1cae15ee7197eb"

    var response = fetch(apiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                getWeather(data.coord.lon, data.coord.lat);
            })
        }
    })
};

$("#search").on("click", function(event){
    event.preventDefault();
    var cityName = $("#city").val();
    getLatLon(cityName);
});

var date = new Date();
date = date.setDate(date.getDate() + 2);
var futureDate = new Date(date).toDateString();
console.log(futureDate);

//display the top half of the webpage (today or current weather condition)
var displayCurrentWeather = function(name, date, temp, humidity, wind_speed, uvi){
    //arr to hold information to concat later
    var dataArr = [temp, humidity, wind_speed, uvi]
    var nameArr = ["Temp: ", "Wind: ", "Humidity: ", "UV Index: "]
    var unitArr = ["\u00B0F", " MPH", " %"]

    //converting binary time into UTC time
    var convertDate = new Date(date * 1000).toLocaleString();
    var dateObj = convertDate.slice(0,8);

    //clearing the section and append the new search section
    document.getElementById("display-data").innerHTML = ""

    var currentWeather = $("<div>").attr("id", "current").addClass("row current d-flex flex-column justify-content-around");
    var h2El = $("<h2>").attr("id", "city-name").addClass("pl-3 pt-2").text(name.toUpperCase() + " (" + dateObj + ")");
    currentWeather.append(h2El) // append the city name and date.

    //append the temp, wind humidity and uv index
    for(var i = 0; i < 4; i++){
        if (i < 3){
            var pEl = $("<p>").attr("id", dataArr[i]).text(nameArr[i] + dataArr[i] + unitArr[i]);
            currentWeather.append(pEl);
        } else { // change the color of background of UV index depending on how high the UV index is serve as a warning. 
            if (dataArr[i] <= 2){
                var spanEl = $("<span>").addClass("text-light pl-3 pr-3 text-center bg-success").text(dataArr[i])
                pEl = $("<p>").attr("id", dataArr[i]).text(nameArr[i]);
                pEl.append(spanEl);
                currentWeather.append(pEl);
            } else if ( dataArr[i] > 2 && dataArr[i] <= 5){
                var spanEl = $("<span>").addClass("text-light pl-3 pr-3 text-center bg-warning").text(dataArr[i])
                pEl = $("<p>").attr("id", dataArr[i]).text(nameArr[i]);
                pEl.append(spanEl);
                currentWeather.append(pEl);
            } else if (dataArr[i] > 5 && dataArr[i] <= 10){
                var spanEl = $("<span>").addClass("text-light pl-3 pr-3 text-center bg-danger").text(dataArr[i])
                pEl = $("<p>").attr("id", dataArr[i]).text(nameArr[i]);
                pEl.append(spanEl);
                currentWeather.append(pEl);
            } else {
                var spanEl = $("<span>").addClass("text-light pl-3 pr-3 text-center bg-secondary").text(dataArr[i])
                pEl = $("<p>").attr("id", dataArr[i]).text(nameArr[i]);
                pEl.append(spanEl);
                currentWeather.append(pEl);
            }
        }
    }

    $("#display-data").append(currentWeather);
};

var display5Day = function (name, date, temp, humidity, wind_speed, uvi, icon){
    var convertDate = new Date(date * 1000).toLocaleString();

    var arr = [name, convertDate, temp, humidity, wind_speed, uvi, icon];

    console.log("http://openweathermap.org/img/w/" + icon + ".png");
};


var getWeather = function(cityName,lon, lat){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=9698d78e4b0b91d10c1cae15ee7197eb"

    var response = fetch(apiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                for(var i = 0; i < 6; i++){
                    if (i === 0){ //first index is today weather
                        displayCurrentWeather(cityName, data.daily[i].dt, data.daily[i].temp.day, data.daily[i].humidity, data.daily[i].wind_speed, data.daily[i].uvi);
                    } else { //the rest is 5 day forecast, need the icon for the image.
                        display5Day(cityName, data.daily[i].dt, data.daily[i].temp.day, data.daily[i].humidity, data.daily[i].wind_speed, data.daily[i].uvi, data.daily[i].weather[0].icon);
                    }
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
                getWeather(city, data.coord.lon, data.coord.lat);
            })
        } else {
            console.log("error: please enter a valid city name");
        }
    })
};

$("#search").on("click", function(event){
    event.preventDefault();

    var cityName = $("#city").val();

    getLatLon(cityName);

});


var displayCurrentWeather = function(name, date, temp, humidity, wind_speed, uvi){
    var dataArr = [temp, humidity, wind_speed, uvi]
    var nameArr = ["Temp: ", "Wind: ", "Humidity: ", "UV Index: "]
    var unitArr = ["\u00B0F", " MPH", " %"]

    var convertDate = new Date(date * 1000).toLocaleString();
    var dateObj = convertDate.slice(0,8);

    document.getElementById("display-data").innerHTML = ""

    var currentWeather = $("<div>").attr("id", "current").addClass("row current d-flex flex-column justify-content-around");
    var h2El = $("<h2>").attr("id", "city-name").addClass("pl-3 pt-2").val(name).text(name + " (" + dateObj + ")");
    
    currentWeather.append(h2El);

    for(var i = 0; i < 4; i++){
        if (i < 3){
            var pEl = $("<p>").attr("id", dataArr[i]).text(nameArr[i] + dataArr[i] + unitArr[i]);
            currentWeather.append(pEl);
        } else {
            var spanEl = $("<span>").addClass("text-light pl-3 pr-3 text-center").text(dataArr[i])
            var pEl = $("<p>").attr("id", dataArr[i]).text(nameArr[i]);
            pEl.append(spanEl);
            currentWeather.append(pEl);
        }
    }

    $("#display-data").append(currentWeather);
};

var display5Day = function (name, date, temp, humidity, wind_speed, uvi, icon){
    var convertDate = new Date(date * 1000).toLocaleString();

    var arr = [name, convertDate, temp, humidity, wind_speed, uvi, icon];

    console.log(arr);
};

var getWeather = function(cityName,lon, lat){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=9698d78e4b0b91d10c1cae15ee7197eb"

    var response = fetch(apiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                //storeWeather(cityName, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, "")
                for(var i = 0; i < 6; i++){
                    if (i === 0){
                        displayCurrentWeather(cityName, data.daily[i].dt, data.daily[i].temp.day, data.daily[i].humidity, data.daily[i].wind_speed, data.daily[i].uvi);
                    } else {
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


//display the top half of the webpage (today or current weather condition)
var displayCurrentWeather = function(name, date, temp, humidity, wind_speed, uvi){
    //arr to hold information to concat later
    var dataArr = [temp, humidity, wind_speed, uvi]
    var nameArr = ["Temp: ", "Wind: ", "Humidity: ", "UV Index: "]
    var unitArr = ["\u00B0F", " MPH", " %"]

    //converting binary time into UTC time
    var convertDate = new Date(date * 1000).toLocaleString();
    var dateObj = convertDate.slice(0,8);

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

    create5DaySection(); //create the 5-day forecast section after the current section render
};

var create5DaySection = function(){
    var divEl = $("<div>").addClass("row d-flex flex-column justify-content-around forecast")
    var h2El = $("<h3>").text("5-Day Forecast:").addClass("pt-3 pb-2");
    var cardDiv = $("<div>").addClass("d-flex flex-row justify-content-between").attr("id", "5DayCard");

    divEl.append(h2El);
    divEl.append(cardDiv);

    $("#display-data").append(divEl)
}

var display5Day = function (date, temp, humidity, wind_speed, icon){
    var convertDate = new Date(date * 1000).toLocaleString();
    var dateObj = convertDate.slice(0,8);
    var divEl = $("<div>");
    var card = $("<div>").addClass("card days")
    var cardBody = $("<div>").addClass("card-body");
    var cardTitle = $("<div>").addClass("card-title").text(dateObj);
    var cardImg = $("<img>").attr({src:"http://openweathermap.org/img/wn/10d.png", alt: "weather icon"});
    var cardText = $("<")
    divEl.append(cardImg);
    cardBody.append(cardTitle);
    cardBody.append(divEl);
    card.append(cardBody);

    $("#5DayCard").append(card);


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
                        display5Day(data.daily[i].dt, data.daily[i].temp.day, data.daily[i].humidity, data.daily[i].wind_speed, data.daily[i].weather[0].icon);
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
    document.getElementById("display-data").innerHTML = ""

    var cityName = $("#city").val();

    getLatLon(cityName);

});

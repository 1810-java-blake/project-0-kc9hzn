"use strict";

function Location(latitude, longitude, city, state) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.state = state;
}

function Forecast(date, high, low, summary) {
    this.date = date;
    this.high = high + "°";
    this.low = low + "°";
    this.summary = summary;
}

function getLocation() {
    let location;
    if (window.sessionStorage.length == 0) {
        let apiKey = "e1189c2c66ba4aa6a8e4928bdeb3bde8";
        let locationUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`;
        fetch(locationUrl)
            .then(res => res.json())
            .then(data => {
                location = new Location(data.latitude, data.longitude, data.city, data.state_prov);
                setStorage(location);
                return location
            })
            .catch(err => console.log(err));

   
    } else {

        location = retrieveLocation();
        return location;
    }
}

function setStorage(location) {
    let storage = window.sessionStorage;
    storage.setItem("latitude", location.latitude);
    storage.setItem("longitude", location.longitude);
    storage.setItem("city", location.city);
    storage.setItem("state", location.state);
    window.sessionStorage;
}

function retrieveLocation() {
    let storage = window.sessionStorage;
    let location = new Location(storage.getItem("latitude"),
        storage.getItem("longitude"), storage.getItem("city"),
        storage.getItem("state"));
    return location;
}

function getConditions(location) {
    let forecastArray;
    let resultArray;
    let locationURL = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${location.city}, ${location.state}')&format=json`;
    fetch(locationURL)
        .then(res => res.json())
        .then(data => {
            resultArray = data.query.results.channel.item.forecast;
            forecastArray = new Array(resultArray.length);
            for (let i = 0; i < resultArray.length; i++) {
                forecastArray[i] = new Forecast(date(resultArray[i].date),
                    resultArray[i].high, resultArray[i].low,
                    resultArray[i].text);
            }
            refreshDisplay(forecastArray, location);
        })
        .catch(err => console.log(err));
}

function refreshDisplay(conditions, location) {
    let forecastDisplay = document.getElementsByClassName("forecast-display")[0];
    let locationDisplay = document.getElementsByClassName("location")[0].firstElementChild;
    locationDisplay.innerHTML = `Forecast for ${location.city}, ${location.state}`;
    forecastDisplay.removeChild(forecastDisplay.firstElementChild);
    let div = "<div class='extended-forecast'>";
    let div_e = "</div>";
    let p = "<p>";
    let br = "<br>";
    let p_e = "</p>";
    let results = "";
    for (let i = 0; i < conditions.length; i++) {
        console.log(conditions[i].date);
        results = results + div + p + conditions[i].date + br +
            "High: " + conditions[i].high + br + "Low: " +
            conditions[i].low + br + conditions[i].summary + p_e +
            div_e;
    }
    forecastDisplay.innerHTML = results;
}

function date(date) {
    let values = String(date).split(" ");
    let result;
    switch (values[1]) {
        case "Jan":
            result = "January";
            break;
        case "Feb":
            result = "February";
            break;
        case "Mar":
            result = "March";
            break;
        case "Apr":
            result = "April";
            break;
        case "May":
            result = "May";
            break;
        case "Jun":
            result = "June";
            break;
        case "Jul":
            result = "July";
            break;
        case "Aug":
            result = "August";
            break;
        case "Sep":
            result = "September";
            break;
        case "Oct":
            result = "October";
            break;
        case "Nov":
            result = "November";
            break;
        case "Dec":
            result = "December";
            break;
    }
    result = result + " " + values[0] + ", " + values[2];
    return result;
}

document.addEventListener("DOMContentLoaded", event => {
    let location = getLocation();
    getConditions(location);
});
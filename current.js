"use strict";

function Location(latitude, longitude, city, state) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.state = state;
}

function CurrentConditions(currentSummary, nearestStormDistance,
        precipProbability, precipType, temperature,
        apparentTemperature, dewPoint, humidity, windSpeed,
        windBearing) {
    this.currentSummary = currentSummary;
    this.nearestStormDistance = nearestStormDistance + " miles";
    this.precipProbability = (Math.round(precipProbability * 100)) + "%";
    this.precipType = precipType;
    this.temperature = (Math.round(temperature)) + "°";
    this.apparentTemperature = (Math.round(apparentTemperature)) + "°";
    this.dewPoint = (Math.round(dewPoint)) + "°";
    this.humidity = (Math.round(humidity * 100)) + "%";
    this.windSpeed = (Math.round(windSpeed)) + " mph";
    this.windBearing = bearing(windBearing);
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
    let conditions;
    let apiKey = "f386c5d5bd0791645dc039c3dc85e08f";
    let proxy = "https://cors-anywhere.herokuapp.com/"
    let forecastURL = `https://api.darksky.net/forecast/${apiKey}/${location.latitude},${location.longitude}`;
    fetch(proxy + forecastURL)
        .then(res => res.json())
        .then(data => {
            conditions = new CurrentConditions(data.currently.summary,
                data.currently.nearestStormDistance,
                data.currently.precipProbability,
                data.currently.precipType,
                data.currently.temperature,
                data.currently.apparentTemperature,
                data.currently.dewPoint,
                data.currently.humidity,
                data.currently.windSpeed,
                data.currently.windBearing);
                refreshDisplay(conditions, location);
        })
        .catch(err => console.log(err));
}

function refreshDisplay(conditions, location) {
    let forecastDisplay = document.getElementsByClassName("forecast-display")[0].firstElementChild;
    let newline = "<br>";
    forecastDisplay.innerHTML = "Weather for " + location.city + ", " +
        location.state + newline + "The current weather: " +
        conditions.currentSummary + newline + "Nearest Storm: " +
        conditions.nearestStormDistance + "\t Probability of precipitation: " +
        conditions.precipProbability + newline + "Precipitation type: " +
        conditions.precipType + newline + "Temperature: " +
        conditions.temperature + "\t Feels like: " +
          conditions.apparentTemperature + newline +
         "Dew point: " + conditions.dewPoint + "\t Humidity: " +
         conditions.humidity + newline + "Wind speed: " +
         conditions.windSpeed + " " + conditions.windBearing; 
}

function bearing(windBearing) {
    let ordinalValue = Math.round(windBearing / 16);
    switch (ordinalValue) {
        case 0:
            return "N";
        case 1:
            return "NNE";
        case 2:
            return "NE";
        case 3:
            return "ENE";
        case 4:
            return "E";
        case 5:
            return "ESE";
        case 6:
            return "SE";
        case 7:
            return "SSE";
        case 8:
            return "S";
        case 9:
            return "SSW";
        case 10:
            return "SW";
        case 11:
            return "WSW";
        case 12:
            return "W";
        case 13:
            return "WNW";
        case 14:
            return "NW";
        case 15:
            return "NNW";
        default:
            return "N";
   }
}

document.addEventListener("DOMContentLoaded", event => {
    let location = getLocation();
    getConditions(location);
});
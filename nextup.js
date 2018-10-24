"use strict";

function Location(latitude, longitude, city, state) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.state = state;
}

function UpcomingConditions(minuteSummary, minutePrecipProbability,
        hourSummary, dailySummary, dailyPrecipProbability,
        dailyPrecipType, dailyTemperatureHigh, dailyTemperatureLow,
        dailyApparentTemperatureHigh, dailyApparentTemperatureLow) {
    this.minuteSummary = minuteSummary;
    this.hourSummary = hourSummary;
    this.dailySummary = dailySummary;
    this.minutePrecipProbability = Math.round(minutePrecipProbability * 100) + "%";
    this.dailyPrecipProbability = Math.round(dailyPrecipProbability * 100) + "%";
    this.dailyPrecipType = dailyPrecipType;
    this.dailyTemperatureHigh = Math.round(dailyTemperatureHigh) + "°";
    this.dailyTemperatureLow = Math.round(dailyTemperatureLow) + "°";
    this.dailyApparentTemperatureHigh = Math.round(dailyApparentTemperatureHigh) + "°";
    this.dailyApparentTemperatureLow = Math.round(dailyApparentTemperatureLow) + "°";
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
            conditions = new UpcomingConditions(data.minutely.summary,
                data.minutely.data[0].precipProbability,
                data.hourly.summary, data.daily.summary,
                data.daily.data[0].precipProbability,
                data.daily.data[0].precipType,
                data.daily.data[0].temperatureHigh,
                data.daily.data[0].temperatureLow,
                data.daily.data[0].apparentTemperatureHigh,
                data.daily.data[0].apparentTemperatureLow);
                refreshDisplay(conditions, location);
        })
        .catch(err => console.log(err));
}

function refreshDisplay(conditions, location) {
    let locationDisplay = document.getElementsByClassName("location")[0].firstElementChild;
    let forecastDisplay = document.getElementsByClassName("forecast-display")[0].firstElementChild;
    locationDisplay.innerHTML = `Forecast for ${location.city}, ${location.state}`;
    let table = "<table>";
    let tr = "<tr>";
    let td = "<td>";
    let table_e = "</table>";
    let tr_e = "</tr>";
    let td_e = "</td>";
    let trans1 = td_e + td;
    let trans2 = td_e + tr_e + tr + td;
    forecastDisplay.innerHTML = table + tr + td + "Summary: " + trans1 + 
        conditions.minuteSummary + trans2 + "Precipitation probability" +
        trans1 + conditions.minutePrecipProbability + trans2 +
        "Hourly summary: " + trans1 + conditions.hourSummary + trans2 + 
        "Daily summary: " + trans1 + conditions.dailySummary + trans2 +
        "Precipitation probability: " + trans1 + conditions.dailyPrecipProbability + trans2 +
        "Precipitation type: " + trans1 + conditions.dailyPrecipType + trans2 +
        "High temperature: " + trans1 + conditions.dailyTemperatureHigh + trans2 +
        "Low temperature: " + trans1 + conditions.dailyTemperatureLow + trans2 +
        "Feels Like (High): " + trans1 + conditions.dailyApparentTemperatureHigh + trans2 +
        "Feels Like (Low): " + trans1 + conditions.dailyApparentTemperatureLow +
        td_e + tr_e + table_e;
}

document.addEventListener("DOMContentLoaded", event => {
    let location = getLocation();
    getConditions(location);
});
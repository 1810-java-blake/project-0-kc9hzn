"use strict";

function Location(latitude, longitude, city, state) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.state = state;
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

document.addEventListener("DOMContentLoaded", event => {

});
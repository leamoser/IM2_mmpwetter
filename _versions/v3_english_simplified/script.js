// DOM elements
const buttons_container = document.querySelector("#cities");
const active_city_title_element = document.querySelector('#details>h2');
const active_city_temperature_element = document.querySelector('#temperature');
const active_city_windspeed_element = document.querySelector('#windspeed');
const active_city_icon_element = document.querySelector('#icon');

// base data
const cities = [
    {
        id: 'bern',
        title: 'Bern',
        lat: 46.9489,
        lng: 7.4473
    },
    {
        id: 'chur',
        title: 'Chur',
        lat: 46.8503,
        lng: 9.5236
    },
    {
        id: 'zurich',
        title: 'Zürich',
        lat: 47.3764,
        lng: 8.5393
    },

];

// functionality functions
async function displayCityDetailsById(id) {

    // find selected city
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return;

    // load weather data
    const data = await loadCityDataById(city.id);
    if (!data) return;

    // show data in city details
    active_city_title_element.innerText = city.title;
    active_city_temperature_element.innerText = data.temperature;
    active_city_windspeed_element.innerText = data.windspeed;
    active_city_icon_element.setAttribute('src', `icons/${data.icon}.svg`)

    // set currently active button to inactive
    const currently_active_button = document.querySelector('button.active');
    if (currently_active_button) {
        currently_active_button.classList.remove('active');
    }

    // set new button to active
    const new_active_city_button = document.querySelector(`button#${city.id}`);
    if (new_active_city_button) {
        new_active_city_button.classList.add('active');
    }

}

async function switchActiveCityById(id) {

    // find selected city
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return false;

    // change city details
    await displayCityDetailsById(city.id);

}

// helper functions
async function loadCityDataById(id) {

    // find selected city
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return false;

    // fetch & return API data
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}2&longitude=${city.lng}&current=temperature_2m,wind_speed_10m,weather_code`;
    try {

        // load data from API
        const response = await fetch(url);
        const data = await response.json();

        // prepare and return needed data
        return {
            temperature: Math.round(data.current.temperature_2m),
            windspeed: data.current.wind_speed_10m.toFixed(1),
            icon: getIconByWeatherCode(data.current.weather_code)
        };

    } catch (error) {

        // return false if data could not be fetched
        return false;

    }

}

function getIconByWeatherCode(code) {

    // return weather icon by code
    switch (code) {
        case 0:
            return 'clear_sky';
        case 1:
        case 2:
        case 3:
            return 'mainly_clear';
        case 45:
        case 48:
            return 'fog';
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            return 'drizzle';
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
            return 'rain';
        case 71:
        case 73:
        case 75:
        case 77:
            return 'snowfall';
        case 80:
        case 81:
        case 82:
            return 'rainshowers';
        case 85:
        case 86:
            return 'snowshowers';
        case 95:
            return 'thunderstorm';
        case 96:
        case 99:
            return 'thunderstorm_hail';
        default:
            // default return if other code is entered
            return 'mainly_clear';
    }

}

// initialize functions
async function initCityButtons() {

    // abort if buttons_container does not exist
    if (!buttons_container) return;

    // delete all current content
    buttons_container.innerHTML = ''

    // loop through all available cities
    for (const city of cities) {

        // load city weather data
        const data = await loadCityDataById(city.id);
        if (!data) return;

        // create button element
        const button = document.createElement('button');
        button.setAttribute('id', `${city.id}`);
        button.innerHTML = `
                <span class="circle">
                    <img src="icons/${data.icon}.svg" alt="Icon Wetter ${city.title}">
                </span>
                <span class="city">${city.title}</span>
        `;

        // add event listener to button
        button.addEventListener('click', async function() {
            const id = button.id;
            await switchActiveCityById(id);
        })

        // place created in DOM
        buttons_container.appendChild(button);

    }

}


// initialization
async function init() {

    // initially load buttons for all cities
    await initCityButtons();

    // display weather data of first city in array cities
    await displayCityDetailsById(cities[0].id);

}
await init();

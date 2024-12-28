// dom elements
const buttons_container = document.querySelector("#cities");
const active_city_title_elem = document.querySelector('#details>h2');
const active_city_temperature_elem = document.querySelector('#temperature');
const active_city_windspeed_elem = document.querySelector('#windspeed');
const active_city_icon_elem = document.querySelector('#icon');

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

// functions
async function loadCityDataById(id) {

    // find selected city
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return false;

    // fetch & return API data
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}2&longitude=${city.lng}&current=temperature_2m,wind_speed_10m,weather_code`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            temperature: Math.round(data.current.temperature_2m),
            windspeed: Math.round(data.current.wind_speed_10m),
            icon: getIconByWeatherCode(data.current.weather_code)
        };
    } catch (error) {
        return false;
    }

}

async function displayCityDetailsById(id) {

    // find selected city
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return false;

    // load weather data
    const data = await loadCityDataById(city.id);

    // show data in city details
    active_city_title_elem.innerText = city.title;
    active_city_temperature_elem.innerText = data.temperature;
    active_city_windspeed_elem.innerText = data.windspeed;
    active_city_icon_elem.setAttribute('src', `icons/${data.icon}.svg`)

    // set currently active button to inactive
    const currently_active_button = document.querySelector('button.active');
    if (currently_active_button) {
        currently_active_button.classList.remove('active');
    }

    // set new button to active
    const new_active_city_button = document.querySelector(`button#${city.id}`);
    new_active_city_button.classList.add('active');

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
            return 'mainly_clear';
    }

}

async function initCityButtons() {

    // loop through all available cities
    for (const city of cities) {

        // load city weather data
        const data = await loadCityDataById(city.id);

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

async function switchActiveCityById(id) {

    // find selected city
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return false;

    // change city details
    await displayCityDetailsById(city.id);

}

// init
async function init() {

    // initially load buttons for all cities
    await initCityButtons();

    // display weather data of first city in array cities
    await displayCityDetailsById(cities[0].id);

}
await init();

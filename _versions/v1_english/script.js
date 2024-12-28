// dom elements
const buttons_container = document.querySelector("#cities");
const active_city_title_elem = document.querySelector('#details>h2');
const active_city_temperature_elem = document.querySelector('#temperature');
const active_city_windspeed_elem = document.querySelector('#windspeed');
const active_city_icon_elem = document.querySelector('#icon');

// base data
const cities = [
    {
        slug: 'bern',
        title: 'Bern',
        lat: 46.9489,
        lng: 7.4473
    },
    {
        slug: 'chur',
        title: 'Chur',
        lat: 46.8503,
        lng: 9.5236
    },
    {
        slug: 'zurich',
        title: 'Zürich',
        lat: 47.3764,
        lng: 8.5393
    },

];
let active_city = cities[0];

// functions
async function loadCityData(slug) {
    const city = cities.find(s => s.slug === slug);
    if (!city) return false;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}2&longitude=${city.lng}&current=temperature_2m,wind_speed_10m,weather_code`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        return false;
    }
}
async function displayCityDetails() {
    // load data
    const data = await loadCityData(active_city.slug);
    // show data in city details
    active_city_title_elem.innerText = active_city.title;
    active_city_temperature_elem.innerText = Math.round(data.current.temperature_2m);
    active_city_windspeed_elem.innerText = Math.round(data.current.wind_speed_10m);
    active_city_icon_elem.setAttribute('src', `icons/${getWeatherIconByConditionCode(data.current.weather_code)}.svg`)
    // set currently active button to inactive
    const currently_active_button = document.querySelector('button.active');
    if (currently_active_button) {
        currently_active_button.classList.remove('active');
    }
    // set button to active
    const active_city_button = document.querySelector(`button#${active_city.slug}`);
    active_city_button.classList.add('active');
}
function getWeatherIconByConditionCode(code) {
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
    for (const city of cities) {
        const data = await loadCityData(city.slug);
        const button = document.createElement('button');
        button.setAttribute('id', `${city.slug}`);
        button.addEventListener('click', async function() {
            const slug = button.id;
            await switchActiveCity(slug);
        })
        button.innerHTML = `
                <span class="circle">
                    <img src="icons/${getWeatherIconByConditionCode(data.current.weather_code)}.svg" alt="Icon Wetter ${city.title}">
                </span>
                <span class="city">${city.title}</span>
        `;
        buttons_container.appendChild(button);
    }
}
async function switchActiveCity(slug) {
    active_city = cities.find(city => city.slug === slug);
    await displayCityDetails();
}

// init
async function init() {
    await initCityButtons();
    await displayCityDetails();
}
await init();

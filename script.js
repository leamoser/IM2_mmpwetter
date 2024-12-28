// DOM Elemente
const buttons_container = document.querySelector("#cities");
const active_city_title_element = document.querySelector('#details>h2');
const active_city_temperature_element = document.querySelector('#temperature');
const active_city_windspeed_element = document.querySelector('#windspeed');
const active_city_icon_element = document.querySelector('#icon');

// Grund-Daten
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

// Funktionen für die Grundfunktionalität
async function displayCityDetailsById(id) {

    // finde die aktuelle Stadt anhand der ID
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return;

    // lade die Wetterdaten anhand der ID der Stadt
    const data = await loadCityDataById(city.id);
    if (!data) return;

    // zeige die Wetterdaten im HTML an
    active_city_title_element.innerText = city.title;
    active_city_temperature_element.innerText = data.temperature;
    active_city_windspeed_element.innerText = data.windspeed;
    active_city_icon_element.setAttribute('src', data.icon)

    // setze den aktuell aktiven Button auf inaktiv
    const currently_active_button = document.querySelector('button.active');
    if (currently_active_button) {
        currently_active_button.classList.remove('active');
    }

    // setze den Button der aktuell aktiven Stadt auf aktiv
    const new_active_city_button = document.querySelector(`button#${city.id}`);
    if (new_active_city_button) {
        new_active_city_button.classList.add('active');
    }

}

async function switchActiveCityById(id) {

    // zeige die Detaildaten anhand der ID der Stadt an
    await displayCityDetailsById(id);

}

// Hilfs-Funktionen
async function loadCityDataById(id) {

    // finde die aktuelle Stadt anhand der ID
    const city = cities.find(this_city => this_city.id === id);
    if (!city) return false;

    // lade die Daten aus der API und gib sie zurück
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}2&longitude=${city.lng}&current=temperature_2m,wind_speed_10m,weather_code`;
    try {

        // daten von der API laden
        const response = await fetch(url);
        const data = await response.json();

        // daten aufbereiten und zurückgeben
        return {
            temperature: Math.round(data.current.temperature_2m),
            windspeed: data.current.wind_speed_10m.toFixed(1),
            icon: getIconUrlByWeatherCode(data.current.weather_code)
        };

    } catch (error) {

        // false zurückgeben, wenn nicht von der API gefetcht werden konnte
        return false;

    }

}

function getIconUrlByWeatherCode(code) {

    // fallback-Icon definieren
    let icon = 'mainly_clear'

    // icon anhand des Wetter-Codes definieren
    switch (code) {
        case 0:
            icon = 'clear_sky';
            break;
        case 1:
        case 2:
        case 3:
            icon = 'mainly_clear';
            break;
        case 45:
        case 48:
            icon = 'fog';
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            icon = 'drizzle';
            break;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
            icon = 'rain';
            break;
        case 71:
        case 73:
        case 75:
        case 77:
            icon = 'snowfall';
            break;
        case 80:
        case 81:
        case 82:
            icon = 'rainshowers';
            break;
        case 85:
        case 86:
            icon = 'snowshowers';
            break;
        case 95:
            icon = 'thunderstorm';
            break;
        case 96:
        case 99:
            icon = 'thunderstorm_hail';
            break;
    }

    // url des Icons zusammenstellen und zurückgeben
    return `icons/${icon}.svg`

}

// Initialisierung-Funktionen
async function initCityButtons() {

    // funktion abbrechen, wenn das button_container DOM-Element nicht existiert
    if (!buttons_container) return;

    // das aktuelle HTML aus dem buttons_container löschen
    buttons_container.innerHTML = ''

    // über alle Städte iterieren
    for (const city of cities) {

        // wetterdaten der entsprechenden Stadt laden
        const data = await loadCityDataById(city.id);
        if (!data) return;

        // button-Element erstellen
        const button = document.createElement('button');
        button.setAttribute('id', `${city.id}`);
        button.innerHTML = `
                <span class="circle">
                    <img src="${data.icon}" alt="Icon Wetter ${city.title}">
                </span>
                <span class="city">${city.title}</span>
        `;

        // dem Button einen EventListener hinzufügen
        button.addEventListener('click', async function() {
            const id = button.id;
            await switchActiveCityById(id);
        })

        // button im HTML anzeigen
        buttons_container.appendChild(button);

    }

}


// Initialisierung
async function init() {

    // initially load buttons for all cities
    await initCityButtons();

    // display weather data of first city in array cities
    await displayCityDetailsById(cities[0].id);

}
await init();

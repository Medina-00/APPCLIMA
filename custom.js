const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');
const nameCountry = document.querySelector('#country');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameCity.value === '' || nameCountry.value === '') {
        showError('Ambos campos son obligatorios...');
        return;
    }

    callAPI(nameCity.value, nameCountry.value);
});

function callAPI(city, country){
    const apiId = 'c94a2f90b2b6e6c8dc2beba9edc72331';
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiId}`;

    fetch(url)
        .then(response => response.json())
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                showError('Ciudad no encontrada...');
            } else {
                clearHTML();
                showWeather(dataJSON);
                showForecast(dataJSON);
                console.log(dataJSON)
            }
        })
        .catch(error => {
            console.log(error);
            showError('Hubo un error al obtener el pronóstico...');
        });
}

function showWeather(data){
    const { main: { temp, temp_min, temp_max }, weather: [{ icon }] } = data.list[0];
    const degrees = kelvinToCentigrade(temp);
    const min = kelvinToCentigrade(temp_min);
    const max = kelvinToCentigrade(temp_max);
    

    const content = document.createElement('div');
    content.innerHTML = `
        <h5>Clima actual en : ${data.city.name}</h5>
        <h5>Descripcion del clima : ${data.list[0].weather[0].description}</h5>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
    `;

    result.appendChild(content);
}

function showForecast(data) {
    const forecastList = data.list;
    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast');

    const displayedDays = new Set(); // Utilizamos un conjunto para almacenar los días mostrados

    forecastList.forEach(item => {
        const date = new Date(item.dt_txt);
        const fecha = date.getDate()
        const hora = date.getHours().toString()
        const day = date.toLocaleDateString('es-ES', { weekday: 'long' });
        let contador = 0
        console.log(hora)
        
        // Si ya mostramos este día, no lo mostramos de nuevo
        if (displayedDays.has(fecha)) {
            return;
        }

        displayedDays.add(day);

       
        const { main: { temp,temp_min, temp_max }, weather: [{ icon }] } = item;
        const degrees2 = kelvinToCentigrade(temp);
        const min = kelvinToCentigrade(temp_min);
        const max = kelvinToCentigrade(temp_max);
        
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
            <h3>${day.toUpperCase()}</h3>
            <p>Hora : ${hora}</p>
            <h5>${item.weather[0].description}</h5>
            <h3>${degrees2}°C</h3>
            <p>Max: ${max}°C</p>
            <p>Min: ${min}°C</p>
        `;

        forecastContainer.appendChild(forecastItem);
        contador++;
    });

    result.appendChild(forecastContainer);
}


function showError(message){
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function kelvinToCentigrade(temp){
    return (temp - 273.15).toFixed(1);
}

function clearHTML(){
    result.innerHTML = '';
}

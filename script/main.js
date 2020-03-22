const cityInputBtn = document.querySelector('.city-input'),
      cityInput = document.querySelector('.city-input__input'),
      cityDropdown = document.querySelector('.city-input__dropdown'),
      degreeNum = document.querySelector('.degree__num_deg'),
      degreeDescription = document.querySelector('.degree__description'),
      degreeImg = document.querySelector('.degree__img'),
      wind = document.querySelector('.weather-statistics__subtitle_wind'),
      pressure = document.querySelector('.weather-statistics__subtitle_pressure'),
      humidity = document.querySelector('.weather-statistics__subtitle_humidity'),
      rainProb = document.querySelector('.weather-statistics__subtitle_rain-prob'),
      radioOne = document.getElementById('radio-one'),
      radioTwo = document.getElementById('radio-two');


const API_KEY = '067f7e1ec70cefeecccd5cf457dfac24',
      citiesApi = 'dataBase/cities.json';

let cities = [];


const degToCompass = (num) => {
  var val = Math.floor(num / 45);
  var arr = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
  return arr[(val % 8)];
};


const getCityData = (cityInput) => {
 
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${API_KEY}&lang=ru`)  
  .then(response => {
    if (!response.ok) {
      throw new Error('Ответ сети был не ok. ' + response.status);
    } else return response.json();
  })
  .then(response => {
    degree = response.main.temp - 273;
    degreeNum.textContent = Math.round(parseFloat(response.main.temp)-273.15);
    degreeDescription.textContent = response.weather[0].description;
    degreeImg.src = 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png';
    wind.textContent = response.wind.speed + ' м/с, ' + degToCompass(response.wind.deg);
    pressure.textContent = response.main.pressure + ' мм. рт. ст.';
    humidity.textContent = response.main.humidity + '%';
  });
};




const showCityDropdown = (input, list) => {
  list.textContent = '';

  if(input.value === '') return;

  const filtercity = cities.filter((item) => {
    const fixItem = item.toLowerCase();
    return fixItem.startsWith(input.value.toLowerCase());
  });

  filtercity.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('city-input__dropdown_dropped');
    li.textContent = item;
    list.append(li);
  });

};

const selectCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'li') {
      input.value = target.textContent;
      list.textContent = '';
  }
};

const getCitiesNames = () => {
  fetch(citiesApi)
  .then(response => {
    if (!response.ok) {
      throw new Error('Ответ сети был не ok. ' + response.status);
    } else return response.json();
  })
  .then(response => {
    cities = response.city.map(item => item.name);
  });
};

cityInput.addEventListener('input', () => {
  showCityDropdown(cityInput, cityDropdown);
});

cityDropdown.addEventListener('click', () => {
  selectCity(event, cityInput, cityDropdown);
});

cityInputBtn.addEventListener('submit', (event) => {
  event.preventDefault();
  let cityInput = document.querySelector('.city-input__input');

  getCityData(cityInput.value);

  radioOne.checked = true;
  radioOne.disabled = true;
  radioTwo.disabled = false;
});


radioOne.addEventListener('click', () =>{
  let fahr = document.querySelector('.degree__num_deg').textContent;
  document.querySelector('.degree__num_deg').textContent = Math.round(parseFloat((fahr-32)/1.8));
  radioOne.disabled = true;
  radioTwo.disabled = false;
});

radioTwo.addEventListener('click', () =>{
  let cels = document.querySelector('.degree__num_deg').textContent;
  document.querySelector('.degree__num_deg').textContent = Math.round(parseFloat(cels*1.8+32));
  radioTwo.disabled = true;
  radioOne.disabled = false;
});


getCitiesNames();
getCityData('Омск');
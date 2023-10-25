// api.js
const getWeatherData = async (city) => {
    // a1ad164b504843fa402d95462b500cf1
    try {
        const responce = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a1ad164b504843fa402d95462b500cf1&lang=ru&units=metric`
        );

        return await responce.json()
    } catch (error) {
        console.error(error)
    }
}

// appContent
const createContent = (data) => {
    const main = document.createElement('main')
    const section = document.createElement('section')
    const container = document.createElement('div')
    const inner = document.createElement('div')
    const iconBloc = document.createElement('img')
    const temperature = document.createElement('h2')
    const units = document.createElement('span')
    const description = document.createElement('p')
    const weatherInfo = document.createElement('div')
    const weatherInfoList = document.createElement('ul')
    const weatherInfoWind = document.createElement('li')
    const weatherInfoPressure = document.createElement('li')
    const weatherInfoHumidity = document.createElement('li')
    const weatherInfoChanceOfRain = document.createElement('li')

    section.classList.add('weather')
    container.classList.add('container', 'weather__container')
    inner.classList.add('weather__inner')
    iconBloc.classList.add('weather__icon')
    temperature.classList.add('weather__temperature')
    units.classList.add('weather__units')
    description.classList.add('weather__description')
    weatherInfo.classList.add('weather-info')
    weatherInfoList.classList.add('weather-info__list')
    weatherInfoWind.classList.add('weather-info__item')
    weatherInfoHumidity.classList.add('weather-info__item')
    weatherInfoPressure.classList.add('weather-info__item')
    weatherInfoChanceOfRain.classList.add('weather-info__item')

    temperature.textContent = Math.floor(data.main.temp)
    description.textContent = data.weather[0].description
    iconBloc.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
    units.textContent = 'o'

    main.append(section)
    section.append(container)
    container.append(inner, description, weatherInfo)
    inner.append(iconBloc, temperature, units)
    weatherInfo.append(weatherInfoList)
    weatherInfoList.append(
        weatherInfoWind,
        weatherInfoPressure,
        weatherInfoHumidity,
        weatherInfoChanceOfRain
    )

    return main
}

// appHeader.js
const createHeader = (city) => {
    const header = document.createElement('header')
    const headerContainer = document.createElement('div')
    const headerCity = document.createElement('div')
    const headerUnits = document.createElement('div')
    const cityChange = document.createElement('button')
    const cityLocation = document.createElement('button')
    const cityName = document.createElement('h1')
    const unitsC = document.createElement('button')
    const unitsF = document.createElement('button')
    const cityInner = document.createElement('div')
    const searchBlock = document.createElement('div')
    const searchInput = document.createElement('input')
    const searchBtn = document.createElement('button')
    const errorBlock = document.createElement('p')

    header.classList.add('header')
    headerContainer.classList.add('container', 'header__container')
    headerCity.classList.add('header__city')
    headerUnits.classList.add('header__units')
    cityChange.classList.add('city__change', 'btn-reset')
    cityLocation.classList.add('city__location', 'btn-reset')
    cityName.classList.add('city__name')
    cityInner.classList.add('city__inner')
    unitsC.classList.add('units__c', 'btn-reset', 'unit-current')
    unitsF.classList.add('units__f', 'btn-reset')
    searchBlock.classList.add('search')
    searchInput.classList.add('search_input')
    searchBtn.classList.add('search_btn')
    errorBlock.classList.add('search_error')

    searchBtn.textContent = 'ok'
    cityName.textContent = city
    cityChange.textContent = 'Сменить город'
    cityLocation.textContent = 'Мое местоположение'
    unitsC.textContent = 'C'
    unitsF.textContent = 'F'

    header.append(headerContainer)
    headerContainer.append(headerCity, headerUnits)
    cityInner.append(cityChange, cityLocation)
    headerCity.append(cityName, cityInner)
    headerUnits.append(unitsC, unitsF)

    return header
}





// main.js

const app = async () => {
    const weather = await getWeatherData('Киев')
    const header = createHeader(weather.name)
    const content = createContent(weather)
    document.body.append(header, content)
    console.log(weather)
}

app()





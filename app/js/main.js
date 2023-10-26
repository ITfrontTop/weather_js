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

    cityChange.addEventListener('click', () => {
        headerCity.innerHTML = ''
        searchBlock.append(searchInput, searchBtn, errorBlock)
        headerCity.append(searchBlock)
    })

    const showError = (message) => {
        errorBlock.classList.add('show-error')
        errorBlock.textContent = message
    }

    searchBtn.addEventListener('click', async() => {
        if(!searchInput.value) {
            return
        }

        try {
            const weather = await getWeatherData(searchInput.value)


            if(weather.message) {
                showError(weather.message)
                return
            }

            resetWeatherContent(weather.name, weather)
        } catch (error) {
            console.log(error)
        }
    })

    unitsC.addEventListener('click', () => {
        if(unitsC.classList.contains('unit-current')) {
            return
        } else {
            unitsC.classList.add('unit-current')
            unitsF.classList.remove('unit-current')
            document.querySelector('.weather__units').textContent = 'o'

            const temperature = document.querySelector('.weather__temperature')
            const convertedTemp = fToC(+temperature.textContent)
            temperature.textContent = Math.round(convertedTemp)
        }
    })

    unitsF.addEventListener('click', () => {
        if(unitsF.classList.contains('unit-current')) {
            return
        } else {
            unitsF.classList.add('unit-current')
            unitsC.classList.remove('unit-current')
            document.querySelector('.weather__units').textContent = 'f'
            const temperature = document.querySelector('.weather__temperature')
            const convertedTemp = cToF(+temperature.textContent)
            temperature.textContent = Math.round(convertedTemp)
        }
    })

    window.addEventListener('click', (e) => {
        if(e.target == searchInput || e.target == searchBtn || e.target == cityChange) {
            return
        } else {
            headerCity.innerHTML = ''
            errorBlock.classList.remove('show-error')
            searchInput.value = ''
            headerCity.append(cityName, cityInner)
        }
    })
    

    cityLocation.addEventListener('click', handleWeatherByGeolocation)


    header.append(headerContainer)
    headerContainer.append(headerCity, headerUnits)
    cityInner.append(cityChange, cityLocation)
    headerCity.append(cityName, cityInner)
    headerUnits.append(unitsC, unitsF)

    return header
}

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

// helper.js
const directionOfWind = (degree) => {
    if (degree>337.5) { return 'северный' }
    if (degree>292.5) { return 'северо-западный' }
    if (degree>247.5) { return 'западный' }
    if (degree>202.5) { return 'юго-западный' }
    if (degree>157.5) { return 'южный' }
    if (degree>122.5) { return 'юго-восточный' }
    if (degree>67.5) { return 'восточный' }
    if (degree>22.5) { return 'северо-восточный' }
    return 'северный'
}

 const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
 }

 const cToF = (celsius) => {
    return celsius * 9 / 5 + 32
 }

 const fToC = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9
 }

 const resetWeatherContent = (city, weather) => {
    localStorage.setItem('city', JSON.stringify(city))
    document.body.innerHTML = ''
    const header = createHeader(city)
    const content = createContent(weather)
    document.body.append(header, content)
 }


 // geolocation.js
const handleWeatherByGeolocation = () => {
    const options = {
        enableHighAccuracy: true, 
        timeout: 5000, 
        maximumAge: 0
    }

    const success = async (pos) => {
        const crd = pos.coords

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&apiKey=4ada1ed8a6694bbb816a6614162f9cb0`
        )

        const result = await response.json()
        
        const weather = await getWeatherData(result.features[0].properties.city)
        resetWeatherContent(result.features[0].properties.city, weather)
    }

    const error = (err) => {
        console.log(err.code + ' ' + err.message)
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
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
    const weatherInfoClouds = document.createElement('li')
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
    weatherInfoClouds.classList.add('weather-info__item')
    weatherInfoChanceOfRain.classList.add('weather-info__item')

    temperature.textContent = Math.floor(data.main.temp)
    description.textContent = capitalizeFirstLetter(data.weather[0].description)
    iconBloc.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
    units.textContent = 'o'

    const createWeatherItemTitle = (text) => {
        const span = document.createElement('span')
        span.textContent = text

        return span
    }

    const createWeatherItemContent = (text) => {
        const p = document.createElement('p')
        p.textContent = text

        return p
    }

    weatherInfoWind.append(
        createWeatherItemTitle('Ветер'),
        createWeatherItemContent(data.wind.speed + ' м/с, ' + directionOfWind(data.wind.deg))
    )

    weatherInfoPressure.append(
        createWeatherItemTitle('Давление'),
        createWeatherItemContent(data.main.pressure + ' мм рт. ст.')
    )

    weatherInfoHumidity.append(
        createWeatherItemTitle('Влажность'),
        createWeatherItemContent(data.main.humidity + '%')
    )

    weatherInfoClouds.append(
        createWeatherItemTitle('Облачность'),
        createWeatherItemContent(data.clouds.all + '%')
    )

    main.append(section)
    section.append(container)
    container.append(inner, description, weatherInfo)
    inner.append(iconBloc, temperature, units)
    weatherInfo.append(weatherInfoList)
    weatherInfoList.append(
        weatherInfoWind,
        weatherInfoPressure,
        weatherInfoHumidity,
        weatherInfoClouds
    )

    return main
}


// main.js

const app = async () => {
    const weather = await getWeatherData(JSON.parse(localStorage.getItem('city')) || 'Киев')
    const header = createHeader(weather.name)
    const content = createContent(weather)
    document.body.append(header, content)

}

app()





const searchBtn = document.querySelector(".search-btn")
const searchForm = document.querySelector(".searchForm")

// takes in input value as param.  Sends to api and get's data back.
const getLocationData = async (location) => {
    try {
        await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${config.MY_KEY}`)
            .then((response) => {
                console.log(response.data)
                getLatLong(response.data)
            })
    }
    catch (e) {
        console.log("Error", e)
    }
}

// Expects location data to be passed from getLocationData().  Extracts lat. and lon. from this data.
const getLatLong = (locationData) => {
    try {
        const locationLatitude = locationData[0].lat
        const locationLongitude = locationData[0].lon
        console.log(locationLatitude, locationLongitude)
        getWeatherInfo(locationLatitude, locationLongitude)
    } catch {
        console.log("Lat/Lon Info Unavailable")
    }
}

// Expects latitude and longitude param passed from getLatLong().  Finds weather info from api with given coords.
const getWeatherInfo = async (latitude, longitude) => {
    console.log(latitude, longitude)
    try {
        await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${config.MY_KEY}`)
            .then((response) => {
                console.log(response)
                getTimeInfo(response.data.sys)
                getCurrentTime(response.data)
            })
    }
    catch (e) {
        console.log("ERROR!!", e)
    }
}


// Extracts all time related data from the api data
const getTimeInfo = (locationData) => {
    try {
        const sunriseUnix = locationData.sunrise
        const sunriseTime = convertUnixtoTime(sunriseUnix)
        const sunsetUnix = locationData.sunset
        const sunsetTime = convertUnixtoTime(sunsetUnix)
        const unixCurTime = locationData.dt
        const standCurTime = convertUnixtoTime(unixCurTime)
    } catch (e) {
        console.log("Time data not available", e)
    }
}

// Expects a parameter in Unix time and turns it into standard local Time
const convertUnixtoTime = (unixTime) => {
    try {
        let timeStamp = new Date(unixTime * 1000)
        let hour = timeStamp.getHours()
        let meridiemHour = decypherAmPm(hour)
        let min = timeStamp.getMinutes()
        if (meridiemHour === "PM") { hour -= 12; }
        if (min < 10) { min = `0${min}` }
        const convertedTime = `${hour}:${min} ${meridiemHour}`
        console.log(convertedTime)
        return convertedTime
    }
    catch (e) {
        console.log("Invalid Parameter")
    }
}

// Expects an Int parameter from convertUnixtoTime() and decides if time is AM or PM
const decypherAmPm = (time) => {
    if (time > 12) { time = "PM" }
    else { time = "AM" }
    return time
}

//Starts search using Search Form input value prevent's site from refreshing on submit 
searchBtn.addEventListener("click", (e) => {
    e.preventDefault()
    getLocationData(searchForm[0].value)
})
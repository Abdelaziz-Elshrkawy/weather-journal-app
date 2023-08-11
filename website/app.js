//global variables
const zip = document.getElementById('zip');
const btn = document.getElementById('btn')
const userinput = document.getElementById('userinput');
const errorElement = document.getElementById('error');
const weatherDiv = document.getElementById('weather');
const userDiv = document.getElementById('usersection')
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
//background video playback speed
document.querySelector('video').playbackRate = 0.68;

//retrieving data object from server and updating Html elements
const uiData = async () => {
    const obj = await fetch('/data')
try {
    const dataObj = await obj.json()
    document.getElementById('date').innerHTML = `Date: ${dataObj.date}`;
    document.getElementById('temp').innerHTML = `Actual Temperature: ${dataObj.temp}`;
    if (dataObj.userinput) {
        document.getElementById('user').innerHTML = `Your Feeling <br> ${dataObj.userinput}`
    } else if (dataObj.userinput.length === 0) {
        document.getElementById('user').innerHTML = ' '
    };
    document.getElementById('city').innerHTML = `it feels like (${dataObj.feelsLike}) in ${dataObj.city} now`;
    /* console.log(dataObj) */
} catch (err) {
    console.log(err)
    }
}

//sending data to server
const postData = async (data,userinput) => {
    const temp = data.main.temp;
    const date = new Date();
    let userValue;
    if (userinput.length !== 0) {
        userValue = userinput
    } else {
        userValue = ''
    }
    const finalObj = {
        temp: temp,
        date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
        userinput: userValue,
        city: data.name,
        feelsLike: data.main.feels_like
    }
    try {
        await fetch('/userinput', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalObj)
        })
    } catch (err) {
        console.log(err)
    }
}

//getting weather information from remote api
const apiData = async (baseUrl, zipCode, apiKey) => {
    const url = `${baseUrl}${zipCode}&appid=${apiKey}&units=metric&lang=en`
    /* console.log(url) */
    const weather = await fetch(url);
    let data;
    try {
        data = await weather.json()
        return data;
    } catch (err) {
        console.log(err)
    }
}


btn.addEventListener('click', async () => {
    let apiObj;
    let apiKey
    if (zip.value.length !== 0) {
        //getting url credentials
        await fetch('/apikey').then(data => data.json() ).then(data => apiKey = data.apiKey)
        apiObj = await apiData(baseUrl, zip.value, apiKey)
        if ( apiObj.cod === 200) {
            errorElement.textContent = ' '
            errorElement.style.margin = 'auto'
            errorElement.classList.remove('error')
            postData(apiObj, userinput.value)
            weatherDiv.style.display = 'block'
            userDiv.style.display = 'block'
            uiData()
        } else if (apiObj.cod === 404 || !apiObj.ok) {
            errorElement.classList.add('error')
            errorElement.style.margin = '-28px auto'
            errorElement.textContent = 'ERROR: Zip Code not Valid'
            weatherDiv.style.display = 'none'
            userDiv.style.display = 'none'
        }
    } else {
        errorElement.classList.add('error')
        errorElement.style.margin = '-28px auto'
        errorElement.textContent = 'ERROR: Zip Code is Required'
        weatherDiv.style.display = 'none'
        userDiv.style.display = 'none'
    }   
})

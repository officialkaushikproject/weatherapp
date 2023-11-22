const apiKey_forecast = "3acb2b1681fd373ef63162ab6dd39718";
const apiKey = "2bfc7be350a7419e89d133050231011"

const getLocation = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                handleLocationData();
            },
            (error) => {
                alert("Unable to retrieve your location. Please make sure location services are enabled and try again.",error);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser. Please use a modern browser to access this feature.");
    }
};
// Get daily forecast

const dailyForecast = (data) => {
    document.querySelector(".temp").innerHTML = data.current.temp_c + "<sup>&deg;</sup>C";
    document.querySelector("#city").innerHTML = data.location.name;
    document.querySelector("#condition").innerHTML = data.current.condition.text;
    document.querySelector("#h2_1").innerHTML = data.current.feelslike_c + "<sup>&deg;</sup>";
    document.querySelector("#h2_2").innerHTML = data.current.precip_mm;
    document.querySelector("#h2_3").innerHTML = data.current.cloud;
    document.querySelector("#h2_4").innerHTML = data.current.humidity;
    document.querySelector("#h2_uv").innerHTML = data.current.uv;
    document.querySelector("#h2_wind").innerHTML = Math.round(data.current.wind_kph);
    document.querySelector("#h2_wind2").innerHTML = Math.round(data.current.gust_kph);
}

// Hourly forecast data
const hourlyForecast = (data) => {
    let hoursArr = data.forecast.forecastday[0].hour;
    const hourCard = document.querySelector(".scroll-box");
    hourCard.innerHTML = "";
    const populateCard = () => {
        hoursArr.map((data) => {
            const createEle = document.createElement('div');
            createEle.classList.add('card');
            createEle.innerHTML = `
            <div class="card-content">
            <div class="time">${data.time.slice(11)}</div>
            <div class="temperature">${data.feelslike_c + "°"}</div>
            <img class="icon" src=${data.condition.icon} alt="">
            </div>
            `;
            hourCard.appendChild(createEle)
        })
    }
    populateCard()
}

// 5days forcast data
const fivedays = (data) => {
    let myArrays = data.list;
    let targetIndices = [9, 17, 25, 33, 38];
    for (let i = 0; i < targetIndices.length; i++) {
        let targetIndex = targetIndices[i];
        let targetedArray = myArrays[targetIndex];
        document.getElementById("fordate" + targetIndex).innerHTML = targetedArray.dt_txt.slice(2, 10);
        document.getElementById("foretemp" + targetIndex).innerHTML = Number(targetedArray.main.feels_like - 273.2).toFixed(1) + "°C";
    }
}




const handleLocationData = async () => {
    const api_url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${Number(latitude).toFixed(2)},${Number(longitude).toFixed(2)}`;
    const response = await fetch(api_url);
    var data = await response.json();
    let button_weather = document.querySelector("#searchbox");
    button_weather.value = '';
    dailyForecast(data);
    hourlyForecast(data);

    const api_url_5days = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey_forecast}`;//&units=metric
    const response_5days = await fetch(api_url_5days);
    var data_five = await response_5days.json();
    fivedays(data_five)
};

window.addEventListener("load", getLocation);
window.addEventListener("load", function () {
    document.getElementById('loading-spinner').style.display = 'block';
    document.querySelector('.main').style.filter = "blur(15px)";
    setTimeout(() => {
        document.querySelector('.main').style.filter = "blur(0)";
        document.getElementById('loading-spinner').style.display = 'none';
    }, 3000);
});
document.querySelector('.wind_right').addEventListener('click', () => {
    document.getElementById('loading-spinner').style.display = 'block';
    document.querySelector('.main').style.filter = "blur(15px)";
    handleLocationData()
    setTimeout(() => {
        document.querySelector('.main').style.filter = "blur(0)";
        document.getElementById('loading-spinner').style.display = 'none';
    }, 3000);
})


// ---------------------------------------------------------------------------------------------------

async function getapi(city, apiKey) {
    document.getElementById('loading-spinner').style.display = 'block';
    document.querySelector('.main').style.filter = "blur(15px)";
    try {
        const api_url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}`;
        const response = await fetch(api_url);
        var data = await response.json();
        dailyForecast(data);
        hourlyForecast(data);
    } catch (error) 
    {
        function showAlert() {
            var alertBox = document.getElementById('customAlert');
            alertBox.style.display = 'block';
            setTimeout(function () {
                closeAlert();
            }, 3000);
        }

        function closeAlert() {
            var alertBox = document.getElementById('customAlert');
            alertBox.style.animation = 'fadeOut 0.5s ease-in-out';

            setTimeout(function () {
                alertBox.style.display = 'none';
                alertBox.style.animation = '';
            }, 500);
        }
        showAlert()
    }
    setTimeout(() => {
        document.querySelector('.main').style.filter = "blur(0)";
        document.getElementById('loading-spinner').style.display = 'none';
    }, 2000);
}
// get 5days forecast
async function getforcast(city, apiKey) {
    try {
        const api_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;//&units=metric
        const response = await fetch(api_url);
        var data = await response.json();
        fivedays(data);
    } catch (error) {
        console.log('no data found getforcast');
    }

}


document.querySelector("#sbtn").addEventListener('click', function () {
    let button_weather = document.querySelector("#searchbox")
    let city = button_weather.value;
    getapi(city, apiKey);
})
document.querySelector("#sbtn").addEventListener('click', function () {
    let button_weather = document.querySelector("#searchbox")
    let city = button_weather.value;
    getforcast(city, apiKey_forecast);
})
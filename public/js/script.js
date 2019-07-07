console.log("the client side script is loaded succesfully");


document.getElementById('weather-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let addr = document.getElementById("addr").value;
    fetch(`/weather?address=${addr}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                document.getElementById('forecast').innerHTML = `<p> <b>ERROR: </b> ${data.error}</p>`
            } else
                document.getElementById('forecast').innerHTML = `<h2>weather in ${data.placeName}</h2> <p>The temperature is exprected to be ${data.temperature}&degC with a ${data.rainChance}% chance of rain fall.</p>`
        });
    });
});
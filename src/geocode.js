const request = require('request');
const chalk = require('chalk');

let mapboxURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    mapboxToken = 'pk.eyJ1IjoiYWltOTciLCJhIjoiY2p4cDJxZXpwMGM5bjNjcm5keTc0cWFxNSJ9.tlGLo4jnZ5UpmUWZucbNbw',
    darkskyURL = 'https://api.darksky.net/forecast',
    darkskyToken = '9253b8b95747536fd63307dd686c1b17';

const getLocation = (data, callback) => {
    let _response = {
        error: undefined,
        body: undefined
    };

    // check if there is an error from previous stage
    if (data.error) {
        // if so then just pass the data as is without even trying
        if (callback) callback(data);
        else return data;
    } else {
        let placeName = data.body.placeName,
            url = `${mapboxURL}${encodeURIComponent(placeName)}.json?access_token=${mapboxToken}&limit=1`;
        return request({
                url: `${mapboxURL}${encodeURIComponent(placeName)}.json?access_token=${mapboxToken}&limit=1`,
                json: true
            },
            (error, { body = {} }) => {
                if (error) {
                    _response.error = { message: 'something went wrong with the request' };
                } else if (body.message) {
                    _response.error = { message: `${body.message}` };
                } else if (body.features.length === 0) {
                    _response.error = { message: `seems like input is not quite right` };
                } else {
                    _response.body = {
                        long: body.features[0].center[1],
                        lat: body.features[0].center[0],
                        placeName: body.features[0].place_name
                    };
                }

                if (callback) {
                    callback(_response);
                } else {
                    return _response;
                }
            });
    }
};

const getWeather = (data, callback) => {
    let _response = {
        error: undefined,
        body: undefined
    };

    // check if there is an error from previous stage
    if (data.error) {
        if (callback) callback(data);
        else return data;
    } else {
        let { long, lat, placeName } = data.body;
        return request({
                url: `${darkskyURL}/${darkskyToken}/${encodeURIComponent(long)},${encodeURIComponent(lat)}?units=si`,
                json: true
            },
            (error, { body }) => {
                if (error) {
                    _response.error = { message: `something went wrong with the request` };
                } else if (body.error) {
                    _response.error = { message: `${body.error}` };
                } else {
                    _response.body = {
                        temperature: body.currently.temperature,
                        rainChance: body.currently.precipProbability,
                        placeName
                    };
                }


                if (callback) {
                    callback(_response);
                } else {
                    return _response;
                }
            });
    }
};

const getWeatherForecast = (data, callback) => {
    return getLocation(data, (data) => {
        getWeather(data, callback);
    });
};

module.exports = {
    getLocation,
    getWeather,
    getWeatherForecast
};
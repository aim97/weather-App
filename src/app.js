// built in libraries
const path = require('path');

// insalled packages
const express = require('express');
const chalk = require('chalk');
const hbs = require('hbs');

// my custom modules
const geocode = require('./geocode');

// define paths
const publicDirectoryPath = path.join(__dirname, '../public');
// you don't actually need this line since express by default searches for 
// a directory called views but if you have plans to change that directory 
// name then you should specify that directory and 'set' express 'app' to 
// use it 
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


// create the app
const app = express();

// settings for app
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// allow direct access to all files within public directory
app.use(express.static(publicDirectoryPath));


// set the different routes of our site
app.get('/', (req, res) => {
    res.render('index', {
        title: "Home",
        name: 'aim97'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: 'aim97'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        name: 'aim97'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'an address must be provided'
        });
    }

    geocode.getWeatherForecast({ error: undefined, body: { placeName: req.query.address } }, (data) => {
        console.log('i\'m about to send data')
        if (data.error) {
            res.send({
                error: data.error.message
            });
        } else {
            res.send(data.body);
        }
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 404,
        name: 'aim97',
        error: 'requested help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        name: 'aim97',
        error: 'requested resource not found'
    });
});

// start listening to requests
app.listen(3000, () => {
    console.log(chalk `server is running on port {bold 3000}`)
});
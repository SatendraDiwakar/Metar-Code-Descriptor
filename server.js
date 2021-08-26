const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');
const parseMetar = require('metar');

// set ports
const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.PORT || 6379;

// create redis client
const client = redis.createClient(REDIS_PORT);

const app = express();

// response for /metar/:any route
app.get('/metar/ping', (req, res) => {
    try {
        console.log('Fetching data...');

        const data = JSON.stringify({ data: 'pong' }, null, 2);
        res.send(`<h3><pre>${data}</pre></h3>`);
        
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(`<center><h1>Error ${res.statusCode}...</h1></center>`);
    }
})

// Cache controlled middleware
function cacheControlledMw(req, res, next) {

    const { scode } = req.query;

    if (req.header('Cache-Control') === 'no-cache') {
        next();
    } else {
        client.get(scode, (err, data) => {
            if (err) throw Error;

            if (data !== null) {
                res.send(`<h3><pre>${data}</pre></h3>`);
            } else {
                next();
            }
        });
    }
}

// response for /metar/info route
app.get('/metar/info', cacheControlledMw, async (req, res) => {
    try {
        console.log('Fetching data...');

        const { scode } = req.query;

        const response = await fetch(`https://tgftp.nws.noaa.gov/data/observations/metar/stations/${scode}.TXT`);
        const textData = await response.text();

        // time data formatting
        var obvTime = textData.substr(0, 10) + ' at ' + textData.substr(11, 5) + ' GMT';
        var metarCode = textData.substr(17, textData.length);

        // parsing METAR
        const parsedMetar = parseMetar(metarCode);

        // temperature calculation
        var fTemp = Math.ceil((parsedMetar.temperature * 1.8) + 32);
        var temp = parsedMetar.temperature + ` C (${fTemp} F)`;

        // wind direction calculation
        var dVal = parsedMetar.wind.direction;
        var direction;
        if (dVal >= 0 && dVal <= 90) {
            direction = 'N';
        } else if (dVal > 90 && dVal <= 180) {
            direction = 'W';
        } else if (dVal > 180 && dVal <= 270) {
            direction = 'S';
        } else if (dVal > 270 && dVal <= 360) {
            direction = 'E';
        }

        // wind data formatting
        var mphWindSpeed = Math.ceil(parsedMetar.wind.speed * 1.151);
        var wind = `${direction} at ${mphWindSpeed} mph (${parsedMetar.wind.speed} knots)`;

        // final result
        var finalResult = {
            station: parsedMetar.station,
            last_observation: obvTime,
            temperature: temp,
            wind: wind
        }

        const data = JSON.stringify({ data: finalResult }, null, 2);


        // set data to redis
        client.setex(scode, 300, data);

        res.send(`<h3><pre>${data}</pre></h3>`);

    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(`<center><h1>Error ${res.statusCode}...</h1></center>`);
    }
})

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
})
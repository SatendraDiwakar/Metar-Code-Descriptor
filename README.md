# METAR Data Descriptor

A backend server which takes weather monitoring station code (e.g 'KHUL') and provide current weather information for aviation.


### The purpose of this project is to learn and practice concepts related to:
> - Building a web API
> - NodeJs core
> - Redis caching

#### Dependencies:
> - express
> - redis
> - node-fetch
> - metar
> - Testing API Endpoints (Postman)


### Setup:
> - run npm init to initialize package.json
> - add dependencies
> - add a start script in package.json ( "start": "node server" ) 
> - run npm start on terminal
> - Point browser to ( http://localhost:3000/metar/info?scode=KHUL )

### Assumption:
> - Server runs locally on PORT 3000 and REDIS_PORT 6379
> - The server will response an HTML containing JSON data enclosed between HTML tags.

### API Endpoint:

/metar/info?scode={station code}
(e.g /metar/info?scode=BIIS)

## Sample endpoints using Postman:

### [HttpGet] Sample ping request.

![image](https://github.com/Satendra-EXE/screenshotsMetar/blob/main/samplePostman.png)


### [HttpGet] Fetch data for station code BIIS from browser.

![image](https://github.com/Satendra-EXE/screenshotsMetar/blob/main/scodeMETAR.png)


### [HttpGet] Fetch data for station code BIIS.

![image](https://github.com/Satendra-EXE/screenshotsMetar/blob/main/BIISscode.png)


### [HttpGet] Fetch data for station code BIIS from cache.

![image](https://github.com/Satendra-EXE/screenshotsMetar/blob/main/cached%20BIISscode.png)


### [HttpGet] Fetch data for station code BIIS with cache control.

![image](https://github.com/Satendra-EXE/screenshotsMetar/blob/main/cacheControlledBIISscode.png)

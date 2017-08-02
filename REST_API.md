# Nobil real time rest API

This is documentation on the Nobil real time rest API and examples on how to connect to and use the API.

The Nobil real time rest API provide status changes in electrical car chargerstations found in the Nobil database.



## The rest API

The rest API can be accessed with any http client. The rest API will always respond with JSON objects. The data model
are the same as fund in the stream API. Please read the [Understanding the data model](https://github.com/nobil/nobil-stream-api).

The rest API are available at: http://realtime.nobil.no/


### Obtaining an API key

One do need an API key to access the rest API. The [API key can be obrained from Nobil](http://nobil.no/index.php/bruk-use-api).
The API key are to be added to each request as the value for the query parameter `apikey`.

Example:

```sh
http://realtime.nobil.no/api/v1/rest/connector/NOR_01523_01?apikey=<your_key>
```

The rest API is not intended to be accessed directly from endusers such as and user facing web applications etc since this will
expose your API key to the public.



## Endpoints

The rest API have the following enpoints

### /api/v1/rest/connector/:id

Endpoint for retrieving a single connector

```sh
http://realtime.nobil.no/api/v1/rest/connector/NOR_01523_01?apikey=<your_key>
```

### /api/v1/rest/charger/:id

Endpoint for retrieving a single charger

```sh
http://realtime.nobil.no/api/v1/rest/charger/NOR_01523?apikey=<your_key>
```

### /api/v1/rest/chargers

Endpoint for retrieving all chargers from all countries

```sh
http://realtime.nobil.no/api/v1/rest/chargers?apikey=<your_key>
```

### /api/v1/rest/chargers/:country

Endpoint for retrieving all chargers in one country

```sh
http://realtime.nobil.no/api/v1/rest/chargers/NOR?apikey=<your_key>
```

# Nobil real time stream API

This is documentation on the Nobil real time stream API and examples on how to connect to and use the API.

The Nobil real time stream API provide status changes in electrical car chargerstations found in the Nobil database. In other words; it provide real time status if a chargerstation is in use or not.



## The stream API

The stream API consist of a [Web Socket](http://www.w3.org/TR/websockets/) you as a consumer can connect to. When connected the API will emit events when a change of status in a chargerstation occure. Each emitted event is in the form of a JSON.


### Connecting to the API

One can connect to the stream API on the following URL:

```
ws://realtime.chargelizer.com/api/v1/stream/realtime?key={private_apikey}
```


### Obtaining an API key

One do need an API key to access the steam API. The API key can be obrained xxxxxxxx xxxxxxxxx xxxxxxxx xxxxxxxxx xxxxxxxx xxxxxxxxx xxxxxxxx xxxxxxxxx


## Understanding the data model

To understand the data model (JSON) emitted by the stream API one do need some knowledge of a chargerstation. A chargerstation has one unique ID in the Nobil database but one chargerstation can then have several power outlets.

In real life it is the power outlets which is sending status changes when someone is connecting to or disconnectin from a power outlet out in the wild.

A power outlet on a chargerstation usualy refered to as a connector.


### Statuses

An connector has different statuses and in the objects emitted in the stream API a connector is represented like this:

```javascript
{
    status      : 0,
    error       : 0,
    timestamp   : 1362520099000
}
```

 - `status` - Holds status of the connector represented as integers. -1 indicate a unknown status. 0 indicate that the connector is available. 1 indicate that the connector is occupied.
 - `error` - Holds an error status on the connector represented as integers. 0 indicate no error. 1 indicate that there is an error on the connector.
 - `timestamp` - Holds a timestamp in the format of milliseconds since the epoch. This timestamp is when a change in `status` or `error` occured last on the connector.
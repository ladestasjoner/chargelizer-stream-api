# Nobil real time stream API

This is documentation on the Nobil real time stream API and examples on how to connect to and use the API.

The Nobil real time stream API provide status changes in electrical car chargerstations found in the Nobil database. In other words; it provide real time status if a chargerstation is in use or not.



## The stream API

The stream API consist of a [Web Socket](http://www.w3.org/TR/websockets/) you as a consumer can connect to. The stream API will broadcast JSON objects which can be accessed on the `message` event of the Web Socket.


### Connecting to the API

One can connect to the stream API on the following URL:

```
ws://realtime.chargelizer.com/api/v1/stream/realtime?key={private_apikey}
```


### Obtaining an API key

One do need an API key to access the steam API. The API key can be obrained xxxxxxxx xxxxxxxxx xxxxxxxx xxxxxxxxx xxxxxxxx xxxxxxxxx xxxxxxxx xxxxxxxxx


## Understanding the data model

To understand the data model of the broadcasted objects, one do need some knowledge of a chargerstation. A chargerstation has one unique ID in the Nobil database but one chargerstation can then have several power outlets.

In real life it is the power outlets which is sending status changes when someone is connecting to or disconnectin from a power outlet out in the wild.

A power outlet on a chargerstation usualy refered to as a connector.


### Connector status

An connector has different statuses and in the objects a connector is represented like this:

```javascript
{
    status      : 0,
    error       : 0,
    timestamp   : 1362520099000
}
```

The object keys has the following meaning:

 - `status` - Holds status of the connector represented as integers. -1 indicate a unknown status. 0 indicate that the connector is available. 1 indicate that the connector is occupied.
 - `error` - Holds an error status on the connector represented as integers. 0 indicate no error. 1 indicate that there is an error on the connector.
 - `timestamp` - Holds a timestamp in the format of milliseconds since the epoch. This timestamp is when a change in `status` or `error` occured last on the connector.


### Important

Do note that there is a separate `error` value. An error on a connector can be a lot of different things but when representing the information to a end user one do want to indicate that a charger _might_ not be working due to an error. 

Therefor it is vise to check for `error` before `status` when presenting status of a connector.



## Broadcasted objects

As mentioned the stream API will broadcast objects which will be found on the `message` event. There are several types of objects and to differentiate every type each object is "encapsulated" in a message object which looks like this:

```javascript
{
    type : 'foo:bar',
    data : []
}
```

The object keys has the following meaning:

 - `type` - A string representation of which object type the `data` parameter holds.
 - `data` - The data of the broadcasted object.
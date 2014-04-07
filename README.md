# Nobil real time stream API

This is documentation on the Nobil real time stream API and examples on how to connect to and use the API.

The Nobil real time stream API provide status changes in electrical car chargerstations found in the Nobil database. In other words; it provide real time status if a chargerstation is in use or not.



## The stream API

The stream API consist of a [Web Socket](http://www.w3.org/TR/websockets/) you as a consumer can connect to. The stream API will broadcast JSON objects which can be accessed on the `message` event of the Web Socket.


### Connecting to the API

There is two ways to connect to the stream API. By connecting directly to the stream API with a WebSocket client or having the stream API call back to the consumer.


#### Connecting with a WebSocket client

This is the prefered way to connect to the stream API. The consumer implements a standard WebSocket client which can connect to the stream API. The client then has to connect to the stream API on the following URL:

```
ws://realtime.nobil.no/api/v1/stream?apikey={private_apikey}
```

#### Having the stream API calling back

There are WebSocket server implementations for most languages out there. Sadly there at not that many server side clients. For platforms which does not have a WebSocket client the steam API can be used to ping back to a WebSocket server run by the consumer.

Connection to the consumers WebSocket server is established by doing a `GET` to the stream API with a URL to the consumers WebSocket server which the stream API can connect to. When the stream API get such a request it will try to establish a WebSocket connection on the provided URL.

The `GET` request is done to the following URL:

```
http://realtime.nobil.no/api/v1/stream/pingback?apikey={private_apikey}&url={url_to_websocket_server}
```

The URL to the WebSocket server must contain the protocol. Example:

```
http://realtime.nobil.no/api/v1/stream/pingback?apikey=1234&url=ws://ws.foo.com
```


### Obtaining an API key

One do need an API key to access the steam API. The [API key can be obrained from Nobil](http://nobil.no/index.php/bruk-use-api).


## Understanding the data model

To understand the data model of the broadcasted objects, one do need some knowledge of a chargerstation. A chargerstation has one unique ID in the Nobil database but one chargerstation can then have several power outlets.

In real life it is the power outlets which is sending status changes when someone is connecting to or disconnectin from a power outlet out in the wild.

A power outlet on a chargerstation is refered to as a connector.


### Connector status

An connector has different statuses and in the objects provided by the stream API a connector is represented like this:

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


### Chargerstation status

A chargerstation can contain several connectors and the status of a chargerstation is caclulated by looking at the status of each connector. As an example; if all connectors are in use at a chargerstation the chargerstation if occupied. There is no more room for others to charge. But, if the chargerstation has four connectors and two connectors are in use, there is still two connectors free. In this case the chargerstation is looked upon as available.

The stream API provide a object variable for convenience which holds a value indication the status of the whole chargerstation.

A chargerstation object looks like this:

```javascript
 {
    uuid : "NOR_01333",
    status : -1,
    connectors : []
}
```

The object keys has the following meaning:

 - `uuid` - A unique identifier for each chargerstation
 - `status` - Holds a status for the whole chargerstation based on the status of each connector. -1 is unknown (one or more connectors has the status unknown). 0 is available (one or more connectors are free). 1 is occupied (all connectors are occupied). 2 is error (one or more connectors reports an status error).
 - `connectors` - An array holding a status object for each connector. See connector statuses above.


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


### snapshot:init

When connecting to the stream API a initial event will be emitted. This event will contain an object where `type` has the value `snapshot:init`. `data` on this object is a list of all chargerstations which can deliver real time data.

The object looks like this:

```javascript
{
    type : 'snapshot:init',
    data : [{
        uuid : "NOR_01270",
        connectors : [
            {status : -1, error : 0, timestamp : -1},
            {status : -1, error : 0, timestamp : -1},
            {status : -1, error : 0, timestamp : -1}
        ]
    },
    {
        uuid : "NOR_01342",
        connectors : [
            {status : -1, error : 0, timestamp : -1}
        ]
    }]
}
```

This is a snapshot of how the status on all chargerstation are on the time of connecting to the stream API. In the consumer end one normally will hold this information and then update this data set with the data from every `status:update`.


### status:update

When a `status:update` object is broadcasted there is a real change in the status of a connector on a chargerstation. In other words; someone has connected or disconnected to a connector out in the street or an error on a connector has occured.

The object looks like this:

```javascript
{
    type : "status:update",
    data : {
        uuid : "NOR_01333",
        status : -1,
        connectors : [
            {status :  0, error : 0, timestamp : 1362520099000},
            {status : -1, error : 0, timestamp : -1},
            {status : -1, error : 0, timestamp : -1},
            {status : -1, error : 0, timestamp : -1},
            {status : -1, error : 0, timestamp : -1}
        ]
    }
}
```

To find a change in status the consumer need to compare the data in this object with the previous received values on this chargerstation.


### status:raw

This object is a raw message from the chargerstations out in the street. A chargerstation does ping us with "keep alive" messages from time to time to tell us that they are alive. These messages does not alway need to contain a change in status.

The object looks like this:

```javascript
{
    type : "status:raw",
    code : 1,
    data : {
        uuid        : "NOR_01333",
        connector   : 0,
        status      : 0,
        error       : 0,
        timestamp   : 1362520099000
    }
}
```

Do note that to find status changes it is recommended that one listen for the `status:update` objects. `status:update` does hold real changes from previous update.

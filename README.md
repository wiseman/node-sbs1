node-sbs1
=========

This is a node.js module that parses ASCII messages containing Mode S
[ADS-B](http://en.wikipedia.org/wiki/Automatic_dependent_surveillance-broadcast)
aircraft data that is in "SBS-1 BaseStation port 30003" format.  This
format has become a semi-standard way of sending ADS-B data.

[![build status](https://secure.travis-ci.org/wiseman/node-sbs1.png)](http://travis-ci.org/wiseman/node-sbs1)

SBS-1 messages are in a simple comma-delimited format.  Here are some
examples of the messages this module parses:

```
SEL,,496,2286,4CA4E5,27215,2010/02/19,18:06:07.710,2010/02/19,18:06:07.710,RYR1427
ID,,496,7162,405637,27928,2010/02/19,18:06:07.115,2010/02/19,18:06:07.115,EZY691A
AIR,,496,5906,400F01,27931,2010/02/19,18:06:07.128,2010/02/19,18:06:07.128
STA,,5,179,400AE7,10103,2008/11/28,14:58:51.153,2008/11/28,14:58:51.153,RM
CLK,,496,-1,,-1,2010/02/19,18:18:19.036,2010/02/19,18:18:19.036
MSG,1,145,256,7404F2,11267,2008/11/28,23:48:18.611,2008/11/28,23:53:19.161,RJA1118,,,,,,,,,,,
MSG,2,496,603,400CB6,13168,2008/10/13,12:24:32.414,2008/10/13,12:28:52.074,,,0,76.4,258.3,54.05735,-4.38826,,,,,,0
MSG,3,496,211,4CA2D6,10057,2008/11/28,14:53:50.594,2008/11/28,14:58:51.153,,37000,,,51.45735,-1.02826,,,0,0,0,0
MSG,4,496,469,4CA767,27854,2010/02/19,17:58:13.039,2010/02/19,17:58:13.368,,,288.6,103.2,,,-832,,,,,
MSG,5,496,329,394A65,27868,2010/02/19,17:58:12.644,2010/02/19,17:58:13.368,,10000,,,,,,,0,,0,0
MSG,6,496,237,4CA215,27864,2010/02/19,17:58:12.846,2010/02/19,17:58:13.368,,33325,,,,,,0271,0,0,0,0
MSG,7,496,742,51106E,27929,2011/03/06,07:57:36.523,2011/03/06,07:57:37.054,,3775,,,,,,,,,,0
MSG,8,496,194,405F4E,27884,2010/02/19,17:58:13.244,2010/02/19,17:58:13.368,,,,,,,,,,,,0
```

There's some documentation of the message format at
http://www.homepages.mcb.net/bones/SBS/Article/Barebones42_Socket_Data.htm

Here are some examples of using the module:

```
// Parse a string containing an SBS1 message.
var sbs1 = require('sbs1');
var s = 'MSG,3,496,211,4CA2D6,10057,2008/11/28,14:53:50.594,2008/11/28,14:58:51.153,,37000,,,51.45735,-1.02826,,,0,0,0,0';
var msg = sbs1.parseSbs1Message(s);
if (msg.message_type === sbs1.MessageType.TRANSMISSION &&
    msg.transmission_type === sbs1.TransmissionType.ES_AIRBORNE_POS) {
  console.log('coords: ' + msg.lat + ', ' + msg.lon);
}
```

```
// Connect to a server at localhost:30003 that is sending messages in SBS1
// format.  You can pass an options object containing host and port to
// createClient to connect to a different server/port.
var sbs1 = require('sbs1');
var client = sbs1.createClient();
client.on('message', function(msg) {
  if (msg.message_type === sbs1.MessageType.TRANSMISSION &&
      msg.transmission_type === sbs1.TransmissionType.ES_AIRBORNE_POS) {
    console.log('coords: ' + msg.lat + ', ' + msg.lon);
  }
});
```

## Parsed messages

Parsed messages have the following fields:

|Field            |Description                                                          |
|-----------------|---------------------------------------------------------------------|
|message_type     |See [MessageType](#MessageType).                                     |
|transmission_type|See [TransmissionType](#TransmissionType).                           |
|session_id       |`String`. Database session record number.                            |
|aircraft_id      |`String`. Database aircraft record number.                           |
|hex_ident        |`String`. 24-bit ICACO ID, in hex.                                   |
|flight_id        |`String`. Database flight record number.                             |
|generated_date   |`String`. Date the message was generated.                            |
|generated_time   |`String`. Time the message was generated.                            |
|logged_date      |`String`. Date the message was logged.                               |
|logged_time      |`String`. Time the message was logged.                               |
|callsign         |`String`. Eight character flight ID or callsign.                     |
|altitude         |`Integer`. [Mode C] [1] Altitude relative to 1013 mb (29.92" Hg).    |
|ground_speed     |`Integer`. Speed over ground.                                        |
|track            |`Integer`. Ground track angle.                                       |
|lat              |`Float`. Latitude.                                                   |
|lon              |`Float`. Longitude                                                   |
|vertical_rate    |`Integer`. Climb rate.                                               |
|squawk           |`String`. Assigned [Mode A] [1] squawk code.                         |
|alert            |`Boolean`. Flag to indicate that squawk has changed.                 |
|emergency        |`Boolean`. Flag to indicate emergency code has been set.             |
|spi              |`Boolean`. Flag to indicate Special Position Indicator has been set. |
|is_on_ground     |`Boolean`. Flag to indicate ground squat switch is active.           |

[1]: http://en.wikipedia.org/wiki/Aviation_transponder_interrogation_modes#Mode_A_and_Mode_C

Not all message/transmission types will have values for all fields.
Missing values will be represented by `null` or `undefined` (an empty
comma-delimited value is `null`).

Parsed messages have `generated_timestamp()` and `logged_timestamp()`
methods that parse the corresponding date and time fields and return
`Date` objects.


## <a name="MessageType">MessageType</a>

There are 6 types of SBS-1 messages represented by the `MessageType` enum:

|Enum              |Value   |
|------------------|--------|
|`SELECTION_CHANGE`|`"SEL"` |
|`NEW_ID`          |`"ID"`  |
|`NEW_AIRCRAFT`    |`"AIR"` |
|`STATUS_AIRCRAFT` |`"STA"` |
|`CLICK`           |`"CLK"` |
|`TRANSMISSION`    |`"MSG"` |

`SELECTION_CHANGE`, `NEW_ID`, `NEW_AIRCRAFT`, `STATUS_CHANGE`, and
`CLK` are indicate changes in the state of the SBS-1 software and
aren't typically used by other systems.

`TRANSMISSION` messages contain information sent by aircraft.


## <a name="TransmissionType">TransmissionType</a>

There are 8 subtypes of transmission messages, specified by the
`TransmissionType` enum:

|Enum                   |Value|Description                    |Spec        |
|-----------------------|-----|-------------------------------|------------|
|`ES_IDENT_AND_CATEGORY`|`1`  |ES identification and category |DF17 BDS 0,8|
|`ES_SURFACE_POS`       |`2`  |ES surface position message    |DF17 BDS 0,6|
|`ES_AIRBORNE_POS`      |`3`  |ES airborne position message   |DF17 BDS 0,5|
|`ES_AIRBORNE_VEL`      |`4`  |ES airborne velocity message   |DF17 BDS 0,9|
|`SURVEILLANCE_ALT`     |`5`  |Surveillance alt message       |DF4, DF20   |
|`SURVEILLANCE_ID`      |`6`  |Surveillance ID message        |DF5, DF21   |
|`AIR_TO_AIR`           |`7`  |Air-to-air message             |DF16        |
|`ALL_CALL_REPLY`       |`8`  |All call reply                 |DF11        |

Only `ES_SURFACE_POS` and `ES_AIRBORNE_POS` transmissions will have
position (latitude and longitude) information.

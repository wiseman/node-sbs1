var sbs1 = require('../index');
var test = require('tap').test;


test('SEL', function (t) {
  var s = ('SEL,,496,2286,4CA4E5,27215,2010/02/19,18:06:07.710,2010/02/19,' +
           '18:06:07.710,RYR1427');
  var msg = sbs1.parseSbs1Message(s);
  var string = sbs1.stringify(msg);
  msg = sbs1.parseSbs1Message(string);

  //t.equal(string, s);
  t.equal(msg.message_type, sbs1.MessageType.SELECTION_CHANGE);
  t.equal(msg.transmission_type, null);
  t.equal(msg.session_id, '496');
  t.equal(msg.aircraft_id, '2286');
  t.equal(msg.hex_ident, '4CA4E5');
  t.equal(msg.flight_id, '27215');
  t.equal(msg.generated_date, '2010/02/19');
  t.equal(msg.generated_time, '18:06:07.710');
  var ts = msg.generated_timestamp();
  t.equal(ts.getFullYear(), 2010);
  t.equal(ts.getMonth(), 1);
  t.equal(ts.getDate(), 19);
  t.equal(ts.getHours(), 18);
  t.equal(ts.getMinutes(), 6);
  t.equal(ts.getSeconds(), 7);
  t.equal(ts.getMilliseconds(), 710);
  t.equal(msg.logged_date, '2010/02/19');
  t.equal(msg.logged_time, '18:06:07.710');
  ts = msg.logged_timestamp();
  t.equal(ts.getFullYear(), 2010);
  t.equal(ts.getMonth(), 1);
  t.equal(ts.getDate(), 19);
  t.equal(ts.getHours(), 18);
  t.equal(ts.getMinutes(), 6);
  t.equal(ts.getSeconds(), 7);
  t.equal(ts.getMilliseconds(), 710);
  t.equal(msg.callsign, 'RYR1427');
  t.equal(msg.altitude, null);
  t.equal(msg.ground_speed, null);
  t.equal(msg.track, null);
  t.equal(msg.lat, null);
  t.equal(msg.lon, null);
  t.equal(msg.vertical_rate, null);
  t.equal(msg.squawk, null);
  console.error('alert=' + msg.alert);
  t.equal(msg.alert, null);
  t.equal(msg.emergency, null);
  t.equal(msg.spi, null);
  t.equal(msg.is_on_ground, null);
  t.end();
});

test('STA', function (t) {
  var s = ('STA,,5,179,400AE7,10103,2008/11/28,14:58:51.153,2008/11/28,' +
           '14:58:51.153,RM');
  var msg = sbs1.parseSbs1Message(s);
  var string = sbs1.stringify(msg);
  msg = sbs1.parseSbs1Message(string);

  //t.equal(string, s);
  t.equal(msg.message_type, sbs1.MessageType.STATUS_CHANGE);
  t.equal(msg.transmission_type, null);
  t.equal(msg.callsign, 'RM');
  t.end();
});

test('MSG 1', function(t) {
  var s = 'MSG,1,,,AD18DA,,,,,,258     ,,,,,,,,0,0,0,0';
  var msg = sbs1.parseSbs1Message(s);
  var string = sbs1.stringify(msg);
  msg = sbs1.parseSbs1Message(string);

  //t.equal(string, s);
  t.equal(msg.transmission_type, sbs1.TransmissionType.ES_IDENT_AND_CATEGORY);
  t.equal(msg.session_id, null);
  t.equal(msg.aircraft_id, null);
  t.equal(msg.hex_ident, 'AD18DA');
  t.equal(msg.flight_id, null);
  t.equal(msg.generated_date, null);
  t.equal(msg.generated_time, null);
  t.equal(msg.logged_date, null);
  t.equal(msg.logged_time, null);
  t.equal(msg.callsign, '258     ');
  t.equal(msg.altitude, null);
  t.equal(msg.ground_speed, null);
  t.equal(msg.track, null);
  t.equal(msg.lat, null);
  t.equal(msg.lon, null);
  t.equal(msg.vertical_rate, null);
  t.equal(msg.squawk, null);
  t.equal(msg.alert, false);
  t.equal(msg.emergency, false);
  t.equal(msg.spi, false);
  t.equal(msg.is_on_ground, false);

  s = 'MSG,1,,,AD18DA,,,,,,258     ,,,,,,,,,,,';
  msg = sbs1.parseSbs1Message(s);
  t.equal(msg.alert, null);
  t.equal(msg.emergency, null);
  t.equal(msg.spi, null);
  t.equal(msg.is_on_ground, null);

  s = 'MSG,1,,,AD18DA,,,,,,258     ,,,,,,,,1,,1,-1';
  msg = sbs1.parseSbs1Message(s);
  t.equal(msg.alert, true);
  t.equal(msg.emergency, null);
  t.equal(msg.spi, true);
  t.equal(msg.is_on_ground, true);
  t.end();
});


test('MSG 3', function(t) {
  var s = 'MSG,3,,,76CCE2,,,,,,,5950,,,,,,,0,0,0,0';
  var msg = sbs1.parseSbs1Message(s);
  var string = sbs1.stringify(msg);
  msg = sbs1.parseSbs1Message(string);

  //t.equal(string, s);
  t.equal(msg.transmission_type, sbs1.TransmissionType.ES_AIRBORNE_POS);
  t.equal(msg.session_id, null);
  t.equal(msg.aircraft_id, null);
  t.equal(msg.hex_ident, '76CCE2');
  t.equal(msg.flight_id, null);
  t.equal(msg.generated_date, null);
  t.equal(msg.generated_time, null);
  t.equal(msg.logged_date, null);
  t.equal(msg.logged_time, null);
  t.equal(msg.callsign, null);
  t.equal(msg.altitude, 5950);
  t.equal(msg.ground_speed, null);
  t.equal(msg.track, null);
  t.equal(msg.lat, null);
  t.equal(msg.lon, null);
  t.equal(msg.vertical_rate, null);
  t.equal(msg.squawk, null);
  t.equal(msg.alert, false);
  t.equal(msg.emergency, false);
  t.equal(msg.spi, false);
  t.equal(msg.is_on_ground, false);

  s = 'MSG,3,,,76CCE2,,,,,,,5925,,,34.01839,-118.35263,,,0,0,0,0';
  var msg = sbs1.parseSbs1Message(s);
  t.equal(msg.transmission_type, sbs1.TransmissionType.ES_AIRBORNE_POS);
  t.equal(msg.session_id, null);
  t.equal(msg.aircraft_id, null);
  t.equal(msg.hex_ident, '76CCE2');
  t.equal(msg.flight_id, null);
  t.equal(msg.generated_date, null);
  t.equal(msg.generated_time, null);
  t.equal(msg.logged_date, null);
  t.equal(msg.logged_time, null);
  t.equal(msg.callsign, null);
  t.equal(msg.altitude, 5925);
  t.equal(msg.ground_speed, null);
  t.equal(msg.track, null);
  t.equal(msg.lat, 34.01839);
  t.equal(msg.lon, -118.35263);
  t.equal(msg.vertical_rate, null);
  t.equal(msg.squawk, null);
  t.equal(msg.alert, false);
  t.equal(msg.emergency, false);
  t.equal(msg.spi, false);
  t.equal(msg.is_on_ground, false);
  t.end();
});


test('MSG 4', function(t) {
  var s = 'MSG,4,,,76CCE2,,,,,,,,215,83,,,-1600,,0,0,0,0';
  var msg = sbs1.parseSbs1Message(s);
  var string = sbs1.stringify(msg);
  msg = sbs1.parseSbs1Message(string);

  //t.equal(string, s);
  t.equal(msg.transmission_type, sbs1.TransmissionType.ES_AIRBORNE_VEL);
  t.equal(msg.session_id, null);
  t.equal(msg.aircraft_id, null);
  t.equal(msg.hex_ident, '76CCE2');
  t.equal(msg.flight_id, null);
  t.equal(msg.generated_date, null);
  t.equal(msg.generated_time, null);
  t.equal(msg.logged_date, null);
  t.equal(msg.logged_time, null);
  t.equal(msg.callsign, null);
  t.equal(msg.altitude, null);
  t.equal(msg.ground_speed, 215);
  t.equal(msg.track, 83);
  t.equal(msg.lat, null);
  t.equal(msg.lon, null);
  t.equal(msg.vertical_rate, -1600);
  t.equal(msg.squawk, null);
  t.equal(msg.alert, false);
  t.equal(msg.emergency, false);
  t.equal(msg.spi, false);
  t.equal(msg.is_on_ground, false);
  t.end();
});

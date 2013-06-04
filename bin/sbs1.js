#!/usr/bin/env node
// Sample program that prints aircraft coordinates.

var usage = require('optimist')
  .usage('Print aircraft positions\n\n' +
         'Read SBS1 messages from a file:\n' +
         '  $0 < <file>\n\n' +
         'Connect to server that streams SBS1 messages:\n' +
         '  $0 [--port <port>] <host>');
var sbs1 = require('../index.js');
var readline = require('readline');

var argv = usage.argv;


function print_msg(msg) {
  if (msg.callsign) {
    console.log(msg.hex_ident + ' (' + msg.callsign + '): ' +
                msg.lat + ', ' + msg.lon);
  } else {
    console.log(msg.hex_ident + ': ' +
                msg.lat + ', ' + msg.lon);
  }
}


if (argv.help || argv.h) {
  console.log(usage.help());
  process.exit();
}

if (argv._.length > 0) {
  // Connect to server
  var host = argv._;
  var port = argv.port || 30003;
  var client = sbs1.createClient({
    host: host,
    port: port
  });
  client.on('message', function(msg) {
    if (msg.lat !== undefined && msg.lat !== null) {
      print_msg(msg);
    }
  });
  client.on('error', function(err) {
    console.error('Error communicating with SBS1 server at ' +
                  host + ':' + port + ': ' + err);
    process.exit(1);
    });
} else {
  // Read from stdin.
  var rl = readline.createInterface({
    input: process.stdin,
    output: '/dev/null'
  });

  rl.on('line', function(line) {
    var msg = sbs1.parseSbs1Message(line);
    if (msg.lat !== undefined && msg.lat !== null) {
      print_msg(msg);
    }
  });
}

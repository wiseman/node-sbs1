#!/usr/bin/env node
// Sample program that prints aircraft coordinates.

var argv = require('yargs')
      .usage('Print aircraft positions')
      .example('$0 < <file>', 'Read SBS1 messages from a file')
      .example('$0 [--port <port>] <host>', 'Connect to server that streams SBS1 messages')
      .option('port', {
        'default': 30003,
        'describe': 'The port to connect to',
        'type': 'number'})
      .help('h')
      .alias('h', 'help')
      .argv;
var sbs1 = require('../index.js');
var readline = require('readline');

function print_msg(msg) {
  if (msg.callsign) {
    console.log(msg.hex_ident + ' (' + msg.callsign + '): ' +
                msg.lat + ', ' + msg.lon);
  } else {
    console.log(msg.hex_ident + ': ' +
                msg.lat + ', ' + msg.lon);
  }
}


if (argv._.length > 0) {
  // Connect to server
  var host = argv._[0];
  var port = argv.port;
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

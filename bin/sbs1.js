var argv = require('optimist').argv;
var sbs1 = require('../index.js');
var readline = require('readline');

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
      console.log(msg.lat + ', ' + msg.lon);
    }
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
      console.log(msg.lat + ', ' + msg.lon);
    }
  });
}

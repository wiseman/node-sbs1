var events = require('events');
var net = require('net');
var readline = require('readline');
var util = require('util');


module.exports = Client;
util.inherits(Client, events.EventEmitter);
function Client(options) {
  events.EventEmitter.call(this);

  options = options || {};
  var host = options.host || 'localhost';
  var port = options.port || 30003;
  this.socket = net.connect(
    {
      host: host,
      port: port
    },
    function() {
      console.log('Connected to SBS1 messages at ' +
                  host + ':' + port);
    });
  this.socket_rl = readline.createInterface({
    input: this.socket,
    output: '/dev/null'});
  this.socket_rl.on('line', function(line) {
    console.log('Received ' + line);
    });
}

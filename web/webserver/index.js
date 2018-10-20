var express = require('express');
var app = express();
var net = require('net');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/temperature', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ temperature: 24 }));
  /*var client = new net.Socket();

  client.connect(5000, '192.168.0.111', function() {
  	console.log('Connected');
  	client.write('{ "action": "write", "item": "light1", "value": 1 }');
    client.end();
  });

  client.on('data', function(data) {
  	console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
  });

  client.on('close', function() {
	  console.log('Connection closed');
  });*/
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
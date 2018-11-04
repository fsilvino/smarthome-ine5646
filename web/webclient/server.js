const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const espIP = '172.20.10.4';
const espPORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/temperature', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ temperature: 30.5 });
  res.end();
});

app.get('/api/last-temperatures', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify([
    { date: "20/10/2018", max: 29, min: 23 },
    { date: "21/10/2018", max: 27, min: 20 },
    { date: "22/10/2018", max: 31.5, min: 26 },
    { date: "23/10/2018", max: 30.5, min: 24 },
    { date: "24/10/2018", max: 31, min: 21 },
    { date: "25/10/2018", max: 32, min: 22 },
    { date: "26/10/2018", max: 30, min: 20 },
    { date: "27/10/2018", max: 31, min: 19.5 },
    { date: "28/10/2018", max: 28.5, min: 14 },
    { date: "29/10/2018", max: 27, min: 19.4 },
    { date: "30/10/2018", max: 29.3, min: 16 },
    { date: "31/10/2018", max: 24, min: 19 },
    { date: "01/11/2018", max: 28, min: 10 },
    { date: "02/11/2018", max: 32, min: 18 },
    { date: "03/11/2018", max: 29, min: 20 }
  ]));
  res.end();
});

app.get('/api/light/:led', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  var led = req.params.led;

  res.send({ light: "light" + led, value: 1 });

  /*var client = new net.Socket();

  client.connect(espPORT, espIP, function() {
  	console.log('Connected');
    //client.write('{ "action": "read", "item": "light' + led + '" }');
    client.write(JSON.stringify({
      action: "read",
      item: "light" + led
    }));
    client.end();
  });

  client.on('data', function(data) {
    var response = JSON.parse(data);
    client.destroy();
    res.send({
      status: response.status,
      light: "light" + led,
      value: response.value
    });
    res.end();
  });

  client.on('close', function() {
	  console.log('Connection closed');
  });

  */

  res.end();
});

app.post('/api/light/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  var led = req.body.led || "1";
  var state = req.body.state || "0";

  res.send({
    status: "success",
    light: "light" + led,
    value: state
  });
  res.end();

  /*
  var client = new net.Socket();

  client.connect(espPORT, espIP, function() {
  	console.log('Connected');
    //client.write('{ "action": "write", "item": "light' + led + '", "value": ' + value + ' }');
    client.write(JSON.stringify({
      action: "write",
      item: "light" + led,
      value: value
    }));
    client.end();
  });

  client.on('data', function(data) {
  	console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
    res.send({
      status: "success",
      value: value
    });
    res.end();
  });

  client.on('close', function() {
	  console.log('Connection closed');
  });

  res.end();
  */
});

app.listen(port, () => console.log(`Backend listening on port ${port}`));
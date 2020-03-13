const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');

const app = express();
const port = process.env.PORT || 5000;
const espIP = '192.168.0.17';
const espPORT = 6000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/smarthome');
const Temperature = mongoose.model('Temperature', { date: Date, value: Number });

const moment = require('moment');

function wait(time) {
  var waitTill = new Date(new Date().getTime() + time);
  while(waitTill > new Date()){}
}

app.get('/api/temperature', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // res.send({ temperature: 30.5 });
  // res.end();

  console.log('Temperature requested!');

  var client = new net.Socket();
  client.connect(espPORT, espIP, function() {
    console.log("Sending JSON to ESP8266 to read the temperature...");
    client.write(JSON.stringify({action: 'read', item: 'temperature'}));
    client.end();
  });

  client.on('data', function(data) {
    console.log("Receiving data from ESP8266 about the temperature...");
    var response = JSON.parse(data);

    console.log("Saving data to mongodb...");
    var temperature = new Temperature({
      date: moment().format(),
      temperature: response.value
    });
    temperature.save();
    client.destroy();

    console.log("Responding http request...");
    res.send({ temperature: response.value });
    res.end();
  });
});

app.get('/api/last-temperatures', (req, res) => {
  // temperatures = Temperature.aggregate([{
  //   $group: {
  //     _id: '$date',
  //     max: { $max: '$value' },
  //     min: { $min: '$value' }
  //   }
  // }]).exec((err, result) => {
  //     res.setHeader('Content-Type', 'application/json');
  //     res.send(result);
  //     res.end();
  // });
});

app.get('/api/light/1', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  var led = "1";//req.params.led;

  console.log("Led: " + led);

  var client = new net.Socket();
  client.connect(espPORT, espIP, function() {
    console.log("Sending JSON to ESP8266 to read the temperature...");
    //client.write(JSON.stringify({action: 'read', item: 'temperature'}));
    client.end();
  });

  client.on('data', function(data) {
    
    res.end();
  });

  // res.send({ light: "light" + led, value: 1 });
  // res.end();

  // wait(1500);

  // var clientLed = new net.Socket();

  // clientLed.connect(espPORT, espIP, function() {
  //   console.log('Connected with ESP8266 to read light' + led + ' status...');
  //   clientLed.write(JSON.stringify({action: 'read', item: 'light' + led}));
  //   clientLed.end();
  // });

  // clientLed.on('data', function(data) {
  //   console.log('Data received on reading light status...');
  //   var response = JSON.parse(data);
  //   clientLed.destroy();
  //   res.send({ light: response.item, value: response.value });
  //   res.end();
  // });
});

app.post('/api/light/', function (req, res) {
  var led = req.body.led || "1";
  var state = req.body.state || "0";

  res.setHeader('Content-Type', 'application/json');
  res.send({
    status: "success",
    light: "light" + led,
    value: state
  });
  res.end();

  // var client = new net.Socket();

  // client.connect(espPORT, espIP, function() {
  //   console.log('Connected');
  //   client.write(JSON.stringify({
  //     action: "write",
  //     item: "light" + led,
  //     value: state
  //   }));
  //   client.end();
  // });

  // client.on('data', function(data) {
  //   console.log('Received: ' + data);
  //   client.destroy(); // kill client after server's response
  //   res.send({
  //     status: "success",
  //     value: state
  //   });
  //   res.end();
  // });

  // client.on('close', function() {
  //   console.log('Connection closed');
  // });
});

app.put('/api/temperature/:value', function (req, res) {
  // var temperature = new Temperature({
  //   date: moment().format(),
  //   temperature: req.params.value
  // });
  // temperature.save();
});

app.listen(port, () => console.log(`Backend listening on port ${port}`));
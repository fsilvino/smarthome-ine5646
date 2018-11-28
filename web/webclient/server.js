const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const espIP = '172.20.10.4';
const espPORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/smarthome');
const Temperature = mongoose.model('Temperature', { date: Date, value: Number });

const moment = require('moment')

app.get('/api/temperature', (req, res) => {
  var temperature = new Temperature({
    date: moment().format("DD/MM/YYYY"),
    value: Math.random()
  });
  temperature.save();
  
  res.setHeader('Content-Type', 'application/json');
  res.send({ temperature: 30.5 });
  res.end();

  // var client = new net.Socket();
  // client.connect(espPORT, espIP, function() {
  //   client.write(JSON.stringify({action: 'read', item: 'temperature'}));
  //   client.end();
  // });

  // client.on('data', function(data) {
  //   var response = JSON.parse(data);
  //   var temperature = new Temperature({
  //     date: moment().format(),
  //     temperature: response.value
  //   });
  //   temperature.save();
  //   client.destroy();
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send({ temperature: response.value });
  //   res.end();
  // });
});

app.get('/api/last-temperatures', (req, res) => {
  
  temperatures = Temperature.aggregate([{
    $group: {
      _id: '$date',
      max: { $max: '$value' },
      min: { $min: '$value' }
    }
  }]).exec((err, result) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
      res.end();
  });
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
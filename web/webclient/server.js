const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');

const app = express();
const port = process.env.PORT || 5000;
const espIP1 = '172.20.10.4';
const espIP2= '172.20.14.4';
const espPORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/smarthome');
// const Temperature = mongoose.model('Temperature', { date: Date, value: Number });

const moment = require('moment');

app.get('/api/temperature', (req, res) => {
    // var temperature = new Temperature({
    //   date: moment().format("YYYY-MM-DD"),
    //   value: Math.random()
    // });
    // temperature.save();
    var boardId = req.body.boardId;
    var IP = boardId === "1" ? espIP1 : espIP2;
    var client = new net.Socket();
    client.connect(espPORT, IP, function () {
        client.write(JSON.stringify({action: 'read', item: 'temperature'}));
        client.end();
    });

    client.on('error', function (ex) {
        console.log(ex);
    });

    client.on('data', function (data) {
        var response = JSON.parse(data);
        var temperature = new Temperature({
            date: moment().format(),
            temperature: response.value
        });
        temperature.save();
        client.destroy();
        res.setHeader('Content-Type', 'application/json');
        res.send({temperature: response.value});
        res.end();
    });
});

// app.get('/api/last-temperatures', (req, res) => {
//
//   temperatures = Temperature.aggregate([{
//     $group: {
//       _id: '$date',
//       max: { $max: '$value' },
//       min: { $min: '$value' }
//     }
//   }]).exec((err, result) => {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(result);
//       res.end();
//   });
// });

app.get('/api/light/:led', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var led = req.params.led;
    var boardId = req.body.boardId;
    var IP = boardId === "1" ? espIP1 : espIP2;
    var client = new net.Socket();

    client.connect(espPORT, IP, function () {
        console.log('Connected');
        client.write(JSON.stringify({
            action: "read",
            item: "light" + led
        }));
        client.end();
    });

    client.on('data', function (data) {
        var response = JSON.parse(data);
        client.destroy();
        res.send({
            status: response.status,
            light: "light" + led,
            value: response.value
        });
        res.end();
    });

    client.on('close', function () {
        console.log('Connection closed');
    });

    client.on('error', function (ex) {
        console.log(ex);
    });
});

app.post('/api/light/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var led = req.body.led || "1";
    var state = req.body.state || "0";
    var boardId = req.body.boardId;
    var IP = boardId === "1" ? espIP1 : espIP2;
    var client = new net.Socket();
    client.connect(espPORT, IP, function () {
        console.log('Connected');
        client.write(JSON.stringify({
            action: "write",
            item: "light" + led,
            value: value
        }));
        client.end();
    });
    client.on('data', function (data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
        res.send({
            status: "success",
            value: data.value
        });
        res.end();
    });
    client.on('close', function () {
        console.log('Connection closed');
    });
    res.end();
});

app.listen(port, () => console.log(`Backend listening on port ${port}`));
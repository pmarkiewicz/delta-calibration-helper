/* eslint-disable node/no-missing-require */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const http = require('http');

const serialPort = require('serialport');
const parsers = serialPort.parsers;

const config = require('./config');
const utils = require('./utils');
const EPROM = require('./utils.mock').EPROM;

const app = module.exports = express();
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  const v = '1.0';
  const s = `Repetier calibration helper ${v}`;

  res.send(s);
});

//const classes = `${ isLargeScreen() ? '' : (item.isCollapsed ? 'icon-expander' : 'icon-collapser') }`;
//const classes = `${ `icon-${item.isCollapsed ? 'expander' : 'collapser'}` }`;
app.get('/ports', (req, res, next) => {
  serialPort.list()
    .then((ports) => {
      res.json(ports);
    })
    .catch((err) => {
      console.error(err.message);
      res.json([]);
    });
});

app.post('/corrections', (req, res, next) => {
  req.body;
});

app.get('/coords', (req, res, next) => {
  //const coords = utils.generatePoints(70.0);
  //res.json(coords);
  const arr = 'G1'.split('');
  res.json(arr);
  //var enc = new TextEncoder(); // always utf-8
  //res.json(enc.encode("G1"));
});

app.get('/eprom', (req, res, next) => {
  const eprom = utils.parseEprom(EPROM);
  res.json(eprom);
});

app.use(errorHandler());
http.createServer(app).listen(3000, () => {
 console.log('Express server started');
});

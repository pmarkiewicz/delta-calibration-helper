/* eslint-disable node/no-missing-require */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const http = require('http');

const serialPort = require('serialport');
//const parsers = serialPort.parsers;

const config = require('./config');
const utils = require('./utils');
const EPROM = require('./utils.mock').EPROM;
const serialUtils = require('./serialUtils');
const printer = require('./printer');

const app = module.exports = express();
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  const v = '1.0';
  const s = `Repetier calibration helper ${v}`;

  res.send(s);
});

//const classes = `${ isLargeScreen() ? '' : (item.isCollapsed ? 'icon-expander' : 'icon-collapser') }`;
//const classes = `${ `icon-${item.isCollapsed ? 'expander' : 'collapser'}` }`;
app.get('/ports', async (req, res, next) => {

  try {
    const ports = await serialPort.list();
    res.json(ports);
  }
  catch(error) {
      console.error(err.message);
      res.json([]);
  }
});

app.get('/open/:port', async (req, res, next) => {
  try {
    status = await serialUtils.openPort(req.params.port);
    res.json({status});
  }
  catch(error) {
    console.log("ERR: " + err);
    res.send("ERR: " + err);
  }
});

app.post('/corrections', (req, res, next) => {
  req.body;
});

app.get('/coords', (req, res, next) => {
  const coords = printer.generateTestPoints(config.testDistances);
  res.json(coords);
  //const arr = 'G1'.split('');
  //res.json(arr);
  //var enc = new TextEncoder(); // always utf-8
  //res.json(enc.encode("G1"));
});

app.get('/eprom', async (req, res, next) => {
  res.json(await printer.getEprom());
});

app.get('/eprommock', async (req, res, next) => {
  res.json(await printer.getEpromMock());
});

app.get('/printername', async (req, res, next) => {
  res.json(await printer.getPrinterName());
});

app.use(errorHandler());

http.createServer(app).listen(3000, () => {
 console.log('Express server started');
});

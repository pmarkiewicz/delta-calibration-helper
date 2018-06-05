/* eslint-disable node/no-missing-require */
'use strict';

const express = require('express');
const path = require('path');
const url = require('url');


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

const eh = (fn) => {
  return async (req, res, next, ...args) => {
    try {
      const result = await fn(req, res, next, ...args);
      res.json({status: 'ok', result});
    }
    catch (error) {
      console.log('App ERR: ' + error);
      res.json({status: 'error', msg: error.toString()});
    }
  };
};

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/index.*', (req, res, next) => {
  const p = url.parse(req.url).pathname;

  res.sendFile(path.join(`${__dirname}/static${p}`));
});

app.get('/ports', eh(async (req, res, next) => {
    return await serialPort.list();
}));

app.get('/open/:port', eh(async (req, res, next) => {
    return await serialUtils.openPort(req.params.port);
}));

app.get('/version', eh(async (req, res, next, ...args) => {
    return await printer.getFirmware();
}));

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

app.get('/printername', eh(async (req, res, next) => {
  return await printer.getPrinterName();
}));

app.use(errorHandler());

http.createServer(app).listen(3000, () => {
 console.log('Express server started');
});

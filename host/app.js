/* eslint-disable node/no-missing-require */
'use strict';

const express = require('express');
const path = require('path');
const url = require('url');

const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const http = require('http');

const serialPort = require('serialport');

const config = require('./config');
const utils = require('./utils');

const serialUtils = require('./serialUtils');
const printer = require('./printer');
const sleep = require('./utils').sleep;

const websock = require('./websock');

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

app.get('/static/*', (req, res, next) => {
  // security issue
  const p = url.parse(req.url).pathname;

  res.sendFile(path.join(`${__dirname}${p}`));
});

app.get('/ports', eh(async (req, res, next) => {
    return await serialPort.list();
}));

app.get('/open/:port', eh(async (req, res, next) => {
    return await serialUtils.openPort(req.params.port);
}));

app.get('/close', eh(async (req, res, next) => {
  return await serialUtils.closePort();
}));

app.get('/version', eh(async (req, res, next, ...args) => {
  return await printer.getFirmware();
}));

app.get('/endstops', eh(async (req, res, next, ...args) => {
  return await printer.getEndstops();
}));

app.post('/corrections', (req, res, next) => {
  req.body;
});

app.get('/testpoints', eh((req, res, next) => {
  return printer.generateTestPoints(config.testDistance);
}));

app.get('/eprom', eh(async (req, res, next) => {
  return await printer.getEprom();
}));

app.get('/eprommock', async (req, res, next) => {
  res.json(await printer.getEpromMock());
});

app.get('/abort', eh(async (req, res, next) => {
  return await printer.abort();
}));

app.get('/message/:msg', eh(async (req, res, next) => {
  return await printer.display(req.params.msg);
}));


app.use(errorHandler());

const server = http.createServer(app)
websock(server, serialUtils);


//start our server
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

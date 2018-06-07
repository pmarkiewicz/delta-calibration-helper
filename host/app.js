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

const app = module.exports = express();
const sleep = require('./utils').sleep;

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

app.post('/corrections', (req, res, next) => {
  req.body;
});

app.get('/coords', eh((req, res, next) => {
  return printer.generateTestPoints(config.testDistances);
}));

app.get('/eprom', eh(async (req, res, next) => {
  res.json(await printer.getEprom());
}));

app.get('/eprommock', async (req, res, next) => {
  res.json(await printer.getEpromMock());
});

app.get('/sertest', async (req, res, next) => {
  await serialUtils.openPortCB('COM5');

  for (let i = 0; i < 10; i++) {
    await serialUtils.sendCommandCB('N1 M115*39');
    const resp = await serialUtils.getResponse();
    console.log('RESP: ' + resp);
    await sleep(1000);
  }

  serialUtils.closePortCB();

  res.send('done');
});

app.get('/sertestasync', async (req, res, next) => {
  await serialUtils.openPort('COM5');

  for (let i = 0; i < 10; i++) {
    await serialUtils.sendCommand('N1 M115*39');
    const resp = await serialUtils.getResponse();
    console.log('RESP: ' + resp);
    await sleep(1000);
  }
  
  serialUtils.closePort();
});

app.get('/abort', eh(async (req, res, next) => {
  res.json(await printer.abort());
}));

app.use(errorHandler());

http.createServer(app).listen(3000, () => {
 console.log('Express server started');
});

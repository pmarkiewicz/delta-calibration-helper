const SerialPort = require('serialport');
const config = require('./config');
const sleep = require('./utils').sleep;

let port = null;

const wrap = (fn) => {
  return () => {
    return new Promise((resolve, reject) => {
      fn((err) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve();
        }
      });
    })
  };
};

const promisifySerial = () => {
  port.aflush = wrap(port.flush);
  port.adrain = wrap(port.drain);
};

const openPort = async (portName) => {

  if (port) {
    port.close();
  }
  
  port = new SerialPort(portName, {baudRate: config.baudRate, autoOpen: false});
  
  await wrap(port.open);
  promisifySerial();

  return {status: 'ok'};
};

const sendCommand = async (cmd) => {
  await port.aflush();
  port.write(cmd + '\n', 'ascii');
  await port.adrain();
};

const getResponse = async () => {
  let b = '';
  let cmd = 0;

  let buf = port.read();

  while (!buf) {
    await sleep(100);
    buf = port.read();

    if (cmd > config.portTimeout) {
      throw new Error('Timeout - no response');
    }

    cmd += 1;
  }

  b = buf.toString('ascii');
  console.log(b);
  await sleep(100);
  
  while (buf = port.read()) {
    b += buf.toString('ascii');
    await sleep(100);
  }

  return b;
};

const sendWithResp = async (cmd) => {
  await sendCommand(cmd);
  return await serial.getResponse();
};

module.exports = {sendCommand, openPort, getResponse, sendWithResp};
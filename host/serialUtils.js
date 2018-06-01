const SerialPort = require('serialport');
const config = require('./config');
const sleep = require('./utils').sleep;
const util = require('util');
//const parsers = serialPort.parsers;
const strWithChecksum = require('./utils').strWithChecksum;

let flush = null;
let drain = null;

let port = null;

const promisifySerial = () => {
  flush = util.promisify(port.flush);
  drain = util.promisify(port.drain);
};

const openPort = async (portName) => {

  if (port) {
    port.close();
  }
  
  return new Promise((resolve, reject) => {
    port = new SerialPort(portName, {baudRate: config.baudRate, autoOpen: false});
    
    port.open((err) => {
      if (err) {
        reject(err);
      } else {
        promisifySerial();
        resolve('ok');
      }
    });
  });
};

const sendCommandWithChecksum = async (cmd) => {
  await flush();
  const newCmd = strWithChecksum(cmd);
  port.write(newCmd + '\n', 'ascii');
  await drain();
};

const getResponse = async () => {
  let b = '';

  for (let buf = null; buf = port.read(); ) {
    b += buf.toString('ascii');
    await sleep(100);
  }

  return b;
};

module.exports = {sendCommandWithChecksum, openPort, getResponse};
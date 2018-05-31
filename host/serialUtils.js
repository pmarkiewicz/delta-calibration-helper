const SerialPort = require('serialport');
const config = require('./config');
//const parsers = serialPort.parsers;
const strWithChecksum = require('./utils').strWithChecksum;

let port = null;

const openPort = (portName) => {

  if (port) {
    port.close();
  }
  
  return new Promise((resolve, reject) => {
    port = new SerialPort(portName, {baudRate: config.baudRate, autoOpen: false});
    
    port.open((err) => {
      if (err) {
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
};

const sendCommandWithChecksum = (cmd) => {
  const newCmd = strWithChecksum(cmd);
  port.write(newCmd);
}

module.exports = {sendCommandWithChecksum, openPort};
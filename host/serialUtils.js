const SerialPort = require('serialport');
const config = require('./config');
const sleep = require('./utils').sleep;
//const parsers = serialPort.parsers;

let port = null;
let abortState = false;

const wrap = (o, fn) => {
  return () => {
    return new Promise((resolve, reject) => {
      fn.call(o, ((err) => {
        if (err) {
          return reject(new Error(err));
        } else {
          return resolve();
        }
      }));
    })
  };
};

// flush is broken on windows, so small workaround to clear in buffer
const tempFlush = async () => {
  while (port.read()) {
    await sleep(10);
  }
}

const promisifySerial = () => {
  port.aflush = tempFlush;  // wrap(port, port.flush);
  port.adrain = wrap(port, port.drain);
  port.aclose = wrap(port, port.close);
};

const closePort = async () => {

  if (port && port.isOpen) {
    await port.aclose();
    port = null;
  }

  return 'closed';
}

const openPort = async (portName) => {
  abortState = false;

  await closePort();
  
  port = new SerialPort(portName, {baudRate: config.baudRate, autoOpen: false});
  
  try {
    await wrap(port, port.open)();
    promisifySerial();

    return 'opened';
  }
  catch (error) {
    port = null;
    throw error;
  }
};

const sendCommand = async (cmd) => {
  if (abortState) {
    throw new Error('Abort');
  }
  
  if (!port) {
    throw new Error('Port is not open');
  }
  
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

  return b;
  await sleep(100);
  
  while (buf = port.read()) {
    b += buf.toString('ascii');
    await sleep(100);
  }

  return b;
};

const sendWithResp = async (cmd) => {
  await sendCommand(cmd);
  return await getResponse();
};

const abort = async (cmd) => {
  if (!post.isOpen) {
    throw new Error('Port is not open');
  }

  abortState = true;
  await port.aflush();
  port.write(cmd + '\n', 'ascii');;

  return 'aborted';
}

const isAborted = () => {
  return abortState;
}

const resetAbort = () => {
  abortState = false;
};

module.exports = {abort, isAborted, resetAbort, sendCommand, openPort, closePort, getResponse, sendWithResp};
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const config = require('./config');
const sleep = require('./utils').sleep;
//const parsers = serialPort.parsers;

let port = null;
let abortState = false;
let buffer = [];
let streamerFunction = null;

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
const tempFlush = () => {
  buffer = [];
}

const promisifySerial = () => {
  port.aclose = wrap(port, port.close);
  port.adrain = wrap(port, port.drain);
};

const closePort = async () => {
  if (port && port.isOpen) {
    await port.aclose();
    port = null;
  }

  return 'closed';
}

const startStreamData = () => {
  const parser = new Readline();
  port.pipe(parser);
  parser.on('data', (data) => {
    if (!data.startsWith('wait')) {
      console.log(data);
    }
    buffer.push(data);
    if (streamerFunction) {
      streamerFunction(data);
    }
  });
};

const openPort = async (portName) => {
  abortState = false;

  await closePort();
  tempFlush();
  
  port = new SerialPort(portName, {baudRate: config.baudRate, autoOpen: false});
  
  try {
    await wrap(port, port.open)();
    promisifySerial();
    startStreamData();

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
  
  tempFlush();
  console.log(cmd);
  port.write(cmd + '\n', 'ascii');
  await port.adrain();
};

const getResponse = async () => {
  let retries = 0;
  let lastLen = 0;
  const cmdEnd = /^(ok|wait)/.compile();

  // let's wait for 'ok' as long as there are new data
  while (true) {
    await sleep(100);

    if (buffer.length > lastLen) {
      retries = 0;
      lastLen = buffer.length;
    }
    
    // in theory ok may not be last, let's keep it simple for now
    // if (buffer && buffer[buffer.length -1].startsWith('ok')) {
    //   break;
    // }

    if (retries > config.portTimeout) {
      console.log('Timeout - no response');
      throw new Error('Timeout - no response');
    }

    retries += 1;
  }

  const b = buffer;
  buffer = [];

  return b;
};

const sendWithResp = async (cmd) => {
  await sendCommand(cmd);
  return await getResponse();
};

const abort = async (cmd) => {
  if (!port.isOpen) {
    throw new Error('Port is not open');
  }

  abortState = true;
  await tempFlush();
  port.write(cmd + '\n', 'ascii');;

  return 'aborted';
}

const isAborted = () => {
  return abortState;
}

const resetAbort = () => {
  abortState = false;
};

const streamData = (streamer) => {
  streamerFunction = streamer;
};

module.exports = {streamData, abort, isAborted, resetAbort, sendCommand, openPort, closePort, getResponse, sendWithResp};
const WsServer = require('ws').Server;
const serialPort = require('serialport');
const printer = require('./printer');


routes = {
  ports: async () => {
    return await serialPort.list();
  },
  version: async () => {
    return await printer.getFirmware();
  },
  message: async (msg) => {
    return await printer.display(msg);
  },
};

const messageRouter = async (ws, msg) => {
  const params = msg.split(':');
  const fn = params.shift();

  const f = routes[fn];

  if (!f) {
    return ws.json({msg: `Unknown req: '${msg}'`});
  }

  try {
    const result = await f.apply(null, params);
    return ws.json({method: fn, status: 'ok', result});
  }
  catch (error) {
    console.log('WS ERR: ' + error);
    ws.json({status: 'error', msg: error.toString()});  
  }
};

module.exports = (server, streamer) => {
  const wss = new WsServer({server});

  wss.on('connection', (ws) => {
    ws.json = (o) => ws.send(JSON.stringify(o));
  
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => messageRouter(ws, message));
  
    //send immediatly a feedback to the incoming connection    
    ws.send(JSON.stringify({msg: 'conn started'}));

    streamer.streamData((b) => {
      ws.send(JSON.stringify({prn: b.toString('ascii')}));
    });
  });
};


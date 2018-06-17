const handleWs = (ui) => {
  const url = 'ws://localhost:3000';

  let ws = null;
  
  const reconnect = () => {
    if (ws && ws.readyState <= 1) {  // CONNECTING | OPEN
      return;
    }

    ws = new WebSocket(url);

    setTimeout(reconnect, 1000);
  };

  // event emmited when connected
  ws.onopen = function () {
    console.log('websocket is connected ...');
  }

  ws.onclose = () => {
    ui.message('ws closed, reopen');
    ws = null;
    reconnect();
  };

  ws.onerror = () => {
    ui.message('ws error, reopen');
    //ws = null;
    //reconnect();
  };

  // event emmited when receiving message 
  ws.onmessage = function (ev) {
      const result = JSON.parse(ev.data);
      if (result.prn) {
        ui.message(result.prn);
      }
  }
};
const appState = {
  connected: false,
  dataReady: false,
};

const comm = communication();
const ui = uiFunctions(appState);

bindEvents(ui, comm, appState);

getPorts = async () => {
  const resp = await comm.getPorts();
  if (resp.status != 'ok') {
    ui.message(resp.msg);
  } else {
    ui.insertPorts(resp.result);
  }

  ui.updateUI();
};

ui.selectRepetier();
getPorts();



const appState = {
  connected: false,
  dataReady: false,
};

const ui = uiFunctions(appState);
const comm = communication(ui);

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



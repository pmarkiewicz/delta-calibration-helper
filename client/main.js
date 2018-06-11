const appState = {
  connected: false,
  dataReady: false,
};

const ui = uiFunctions(appState);
const comm = communication(ui);

bindEvents(ui, comm, appState);

ui.selectRepetier();
ui.displayPorts();



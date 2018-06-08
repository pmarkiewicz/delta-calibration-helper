const comm = communication();
const ui = uiFunctions();

bindEvents(ui, comm);

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



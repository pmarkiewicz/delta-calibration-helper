// ui events

const bindEvents = function(ui, comm, appState) {
  const downloadData = async () => {
    ui.message('downloading eprom');
    const eprom = await comm.getEPROM();
    ui.paramsToHtml(eprom);

    ui.message('downloading points');
    const pts = await comm.getPoints();
    ui.pointsToHtml(pts.result);

    ui.message('ready');

    appState.dataReady = true;
  };

  document.getElementById('refresh_button').onclick = async (ev) => {
    ev.preventDefault();
    ui.displayPorts();
  };

  document.getElementById('disconnect_button').onclick = async (ev) => {
    ui.message('disconnecting');
    ev.preventDefault();
    const result = await comm.closePort();
    ui.message(result.result);
    appState.connected = false;
    ui.updateUI();
    ui.message('disconnected');
  };
  
  document.getElementById('eprom_button').onclick = async (ev) => {
    ui.message('downloading eprom');
    const eprom = await comm.getEPROM();
    ui.paramsToHtml(eprom);

    ui.message('downloading points');
    const pts = await comm.getPoints();
    ui.pointsToHtml(pts.result);

    ui.message('ready');
  };

  document.getElementById('connect_button').onclick = async (ev) => {
    ev.preventDefault();
    try {
      const port = ui.getPort();

      if (!port) {
        ui.message('No port selected');
        return;
      }

      ui.message(`opening port: ${port}`);
      const resOpen = await comm.openPort(port);
      ui.message(result.result);
      downloadData();
      appState.connected = true;
    }
    catch(error) {
      ui.message(error.toString());
      appState.connected = false;
      appState.dataReady = false;
    }

    ui.updateUI();
  };

  document.getElementById('calibrate_button').onclick = async (ev) => {
    ev.preventDefault();
    //debug;
/*
    if (!appState.dataReady) {
      downloadData();
    }

    const points = await comm.probe();

    if (ui.isNormalizeEnabled()) {
      points = normalizePoints(points);
    }
    ui.pointsToHtml(points);
    ui.calculateCorrections();
*/
    const corrections = ui.getCorrections();

    const res = comm.sendCorrections(corrections);
    if (res.status === 'error') {
      ui.message(res.msg);
    }
  };

  document.getElementById('cleanup_button').onclick = async (ev) => {
    ev.preventDefault();
    ui.cleanMessages();
  };

  document.getElementById('expand_button').onclick = async (ev) => {
    ev.preventDefault();
    document.getElementById('calibration_content_text').style.height = '200pt';
  };

  document.getElementById('contract_button').onclick = async (ev) => {
    ev.preventDefault();
    document.getElementById('calibration_content_text').style.height = '30pt';
  };
};

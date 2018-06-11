// ui events

const bindEvents = function(ui, comm, appState) {
  const downloadData = async () => {
    ui.message('downloading eprom');
    const eprom = await comm.getEPROM();
    if (eprom.status === 'error') {
      ui.message(eprom.msg);
      return false;
    }
    
    ui.paramsToHtml(eprom.result);

    ui.message('downloading points');
    const pts = await comm.getPoints();
    if (pts.status === 'error') {
      ui.message(pts.msg);
      return false;
    }

    ui.pointsToHtml(pts.result);

    ui.message('ready');

    return true;
  };

  document.getElementById('refresh_button').onclick = async (ev) => {
    ev.preventDefault();
    ui.displayPorts();
  };

  document.getElementById('disconnect_button').onclick = async (ev) => {
    appState.connected = false;
    ui.message('disconnecting');
    ev.preventDefault();
    const result = await comm.closePort();
    ui.message(result.msg);
    ui.updateUI();
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

    const port = ui.getPort();

    if (!port) {
      ui.message('No port selected');
      return;
    }

    appState.connected = false;
    appState.dataReady = false;
  
    ui.message(`opening port: ${port}`);
  
    const resOpen = await comm.openPort(port);
  
    if (resOpen.status === 'error') {
      ui.message(resOpen.msg);
    } else {
      appState.connected = true;
      appState.dataReady = downloadData();
    }

    ui.updateUI();
  };

  document.getElementById('save_button').onclick = async (ev) => {
    ev.preventDefault();    
    
    if (!document.getElementById('newxstop').value) {
      ui.message('No calibration done, run calibration first');
      return;
    }

    const corrections = ui.getCorrections();

    const res = await comm.sendCorrections(corrections);
    ui.message(res.msg);
  }

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

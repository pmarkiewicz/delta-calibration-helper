// ui events

const bindEvents = function(ui, comm) {
  document.getElementById('disconnect_button').addEventListener('click', (ev) => {
    ev.preventDefault();
  });

  document.getElementById('connect_button').addEventListener('click', async (ev) => {
    ev.preventDefault();
    const pts = await comm.getPoints();
    ui.message(JSON.stringify(pts));
    ui.pointsToHtml(pts.result);
  });

  document.querySelector('#calibrate_button').addEventListener('click', function(ev) {
    ev.preventDefault();
    debug;
    console.log('calc');
    const normalize = document.querySelector('#normalize_chkbox').checked;
    if (normalize) {
      points = normalizePoints(points);
    }
    ui.pointsToHtml(points);
    ui.calculateCorrections();
    ui.getCorrections();
  });

  document.querySelector('#cleanup_button').addEventListener('click', function(ev) {
    ev.preventDefault();
    ui.cleanMessages();
  });

  document.querySelector('#expand_button').addEventListener('click', function(ev) {
    ev.preventDefault();
    document.querySelector('#calibration_content_text').style.height = '200px';
  });

  document.querySelector('#contract_button').addEventListener('click', function(ev) {
    ev.preventDefault();
    document.querySelector('#calibration_content_text').style.height = '30px';
  });
};

// ui events

const bindEvents = function() {
  document.querySelector('#paste_button').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('#calibration_content_text').value = '';
    document.querySelector('#calibration_content_text').select();
    document.execCommand('paste');
  });

  document.querySelector('#eprom_button').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('#calibration_content_text').value = '';
    document.querySelector('#calibration_content_text').select();
    document.execCommand('paste');
    const params = parseEprom();
    paramsToHtml(params);
    selectRepetier();
  });

  document.querySelector('#calculate_button').addEventListener('click', function(ev) {
    ev.preventDefault();
    debug;
    console.log('calc');
    let points = parseData();
    const normalize = Boolean(document.querySelector('#normalize_chkbox').value);
    if (normalize) {
      points = normalizePoints(points);
    }
    pointsToHtml(points);
    calculateCorrections();
    getCorrections();
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

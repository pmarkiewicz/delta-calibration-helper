// ui
var connected = false;

const template = `
  <div>
    <button id="paste_button">Paste</button>
    <button id="calculate_button"">Calculate</button>
    <input type="checkbox" id="normalize_chkbox"><span>normalize</span>
    <button id="expand_button">&#9660;</button>
    <button id="contract_button">&#9650;</button>
  </div>
  <div>
    <textarea id="calibration_content_text" style="width:100%; height: 30px; box-sizing: border-box; padding: 2px" placeholder="copy output from repetier here"></textarea>
  </div>`;

const insertUI = function() {
  const td = document.querySelector('form').parentNode;
  const frm = td.querySelector('form');
	const tbl = frm.querySelector('table');

	const div = document.createElement("div");
	div.setAttribute("style", "margin: 2px; border: 1px solid gray; background: lightGray");
	div.innerHTML = template;

	td.insertBefore(div, frm);
}

const updateUI = function() {
};

// 09:23:25.257 : Z-probe:1.860 X:0.00 Y:70.00
const re = /[\d:\.\s]+Z-probe:(-?\d+\.\d+)\sX:(-?\d+\.\d+)\sY:(-?\d+\.\d+)/;
const parseData = function() {
  const data = document.querySelector('#calibration_content_text').value.split('\n');
  const points = data.reduce((lst, item) => {
    const m = re.exec(item);

    if (m) {
      const z = parseFloat(m[1]);
      const x = parseFloat(m[2]);
      const y = parseFloat(m[3]);

      lst.push({x, y, z});
    }

    return lst;
  }, []);

  return points;
};

const normalizePoints = function(points) {
    const refZ = points[0].z;

    return points.reduce( (lst, pt) => {
      lst.push({x: pt.x, y: pt.y, z: pt.z - refZ});
      return lst;
    }, []);
};

const calculateCorrections = function() {
  document.querySelector('input[type="button"][value="Calculate"]').click();
};

const pointsToHtml = function(points) {
  document.querySelector('#numPoints').value = points.length;
  const ev = new Event('change');
  document.querySelector('#numPoints').dispatchEvent(ev);

  for (i in points) {
    const pt = points[i];
    document.querySelector('#probeX'+ i).value = pt.x.toFixed(2);
    document.querySelector('#probeY'+ i).value = pt.y.toFixed(2);
    document.querySelector('#probeZ'+ i).value = pt.z.toFixed(3);
  }
};

// M206 T[type] P[pos] [Sint(long] [Xfloat] Set eeprom value
const getCorrections = function() {
  const fromHtml = {
    newxstop: {offset: 893, type: 'S', tid: 1},
    newystop: {offset: 895, type: 'S', tid: 1},      //   1
    newzstop: {offset: 897, type: 'S', tid: 1},      //   1
    newrodlength: {offset: 881, type: 'X', tid: 3},  //   3
    newradius: {offset: 885, type: 'X', tid: 3},       //   3
    newhomedheight: {offset: 153, type: 'X', tid: 3},                 //   3
    newxpos: {offset: 901, type: 'X', tid: 3, argument: 'oldxpos'},                   //   3
    newypos: {offset: 905, type: 'X', tid: 3, argument: 'oldypos'},                   //   3
    newzpos : {offset: 909, type: 'X', tid: 3, argument: 'oldzpos'}                   //   3
  };

  let cmds = '';

  for ([id, params] of Object.entries(fromHtml)) {
    let v = document.querySelector(`#${id}`).value;

    if (params.argument) { // sum two fields
      const arg = document.querySelector(`#${params.argument}`).value;
      v = parseFloat(v) + parseFloat(arg);
    }

    const cmd = `M206 T${params.tid} P${params.offset} ${params.type}${v}\n`;

    cmds += cmd;
  }

  document.querySelector('#commands').rows = 10;
  document.querySelector('#commands').value = cmds;
};

// ui

const uiFunctions = () => {
  let connected = false;

  const template = `
    <div>
      <select id="port_list" data-ext="true"><option value=''>Please Wait...</option></select>
      <button id="connect_button" data-ext="true">Connect</button>
      <button id="disconnect_button" data-ext="true">Disconnect</button>
      <button id="refresh_button" data-ext="true">Refresh</button>
      <button id="calibrate_button" data-ext="true"> --Calibrate Repetier -- </button>
      |
      <button id="save_button" data-ext="true">Save</button>
      <button id="abort_button" data-ext="true">Abort</button>
      |
      <input type="checkbox" data-ext="true" id="normalize_chkbox" title="First Z offset is 0"><span>normalize</span>
      <button id="expand_button" data-ext="true">&#9660;</button>
      <button id="contract_button" data-ext="true">&#9650;</button>
      <button id="cleanup_button" data-ext>&#x20E0;</button>
    </div>
    <div>
      <textarea disabled id="calibration_content_text" data-ext="true" placeholder="message log"></textarea>
    </div>`;

  (() => {  // insert UI
    const td = document.querySelector('form').parentNode;
    const frm = td.querySelector('form');
    const tbl = frm.querySelector('table');

    const div = document.createElement("div");
    div.setAttribute("class", 'helper_bar');
    //div.setAttribute("style", "margin: 2px; border: 1px solid gray; background: lightGray");
    div.innerHTML = template;

    td.insertBefore(div, frm);
  })();

  const portList = document.getElementById('port_list');
  const messages = document.getElementById('calibration_content_text');

  return {
    updateUI:() => {
      if (portList.value === '') {
        document.querySelectorAll('button[data-ext]').forEach((btn) => {
          btn.disabled = true;
        });
        return;
      }
    },

    pointsToHtml: (points) => {
      document.getElementById('numPoints').value = points.length;
      const ev = new Event('change');
      document.getElementById('numPoints').dispatchEvent(ev);
    
      for (i in points) {
        const pt = points[i];
        document.getElementById('probeX'+ i).value = pt.x;
        document.getElementById('probeY'+ i).value = pt.y;
        document.getElementById('probeZ'+ i).value = pt.z || 0;
      }
    },

    calculateCorrections: () => {
      document.querySelector('input[type="button"][value="Calculate"]').click();
    },

    getCorrections: () => {
      const fromHtml = {
        newxstop: {level: 3, compare: 'oldxstop', output: 'TOWER_X_ENDSTOP_OFFSET'},
        newystop: {level: 3, compare: 'oldystop', output: 'TOWER_Y_ENDSTOP_OFFSET'},
        newzstop: {level: 3, compare: 'oldzstop', output: 'TOWER_Z_ENDSTOP_OFFSET'},
        newrodlength: {level: 7, compare: 'oldrodlength', output: 'DIAGONAL_ROD_LENGTH'},
        newradius: {level: 4, compare: 'oldradius', output: 'HORIZONTAL_ROD_RADIUS'},
        newhomedheight: {level: 3, compare: 'oldhomedheight', output: 'Z_MAX_LENGTH'},
        newxpos: {level: 6, arg: 210, compare: 'oldxpos', output: 'ALPHA_A'},
        newypos: {level: 6, arg: 330, compare: 'oldypos', output: 'ALPHA_B'},
        newzpos: {level: 6, arg: 90, compare: 'oldzpos', output: 'ALPHA_C'}
      };
    
      const result = {};
      const level = parseInt(document.querySelector('#numfactors').value);
    
      for (const [id, params] of Object.entries(fromHtml)) {
        if (params.level > level) {
          continue;
        }
    
        const oldv = document.querySelector(`#${params.compare}`).value;
        let v = document.querySelector(`#${id}`).value;
        if (oldv === v) {
          continue;
        }
    
        if (params.arg) { // sum two fields
          v = parseFloat(v) + params.arg;
        }
        
        result[params.output] = v;
      }
      return result;
    },
    
    paramsToHtml: (params) => {
      const toHtml = {
        STEPS_PER_MM:  {id: 'stepspermm'},
        TOWER_X_ENDSTOP_OFFSET: {id: 'oldxstop'},
        TOWER_Y_ENDSTOP_OFFSET: {id: 'oldystop'},
        TOWER_Z_ENDSTOP_OFFSET: {id: 'oldzstop'},
        DIAGONAL_ROD_LENGTH: {id: 'oldrodlength'},
        HORIZONTAL_ROD_RADIUS: {id: 'oldradius'},
        Z_MAX_LENGTH: {id: 'oldhomedheight'},
        ALPHA_A: {id: 'oldxpos', arg: 210},
        ALPHA_B: {id: 'oldypos', arg: 330},
        ALPHA_C: {id: 'oldzpos', arg: 90},
        BED_RADIUS: {id: 'bedradius'}
      };
    
      for (const [key, cfg] of Object.entries(toHtml)) {
        document.querySelector(`#${cfg.id}`).value = cfg;
      }
    },
    
    selectRepetier: () => {
      document.querySelector('input[type="radio"][value="Repetier"]').click();
    },

    message: (msg) => {
      messages.value += msg + '\n';
      // const newItem = document.createElement("div");
      // newItem.innerText = msg;
      // messages.appendChild(newItem);
    },

    cleanMessages: () => {
      messages.value = '';
    },

    insertPorts: (ports) => {
      if (ports.length === 0) {
        portList.innerHTML = '<option value="">no port detected</option>';
        return;
      }

      portList.innerHTML = '';
      for (const port of ports) {
        const newOption = document.createElement("option");
  
        newOption.text = port.comName;
        if (port["manufacturer"]) {
          newOption.title = port["manufacturer"];
        }
        newOption.value = port.comName;
        portList.appendChild(newOption);
      }
          
    }
  }
};

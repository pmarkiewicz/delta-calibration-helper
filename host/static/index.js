
const request = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    }
    xhr.ontimeout = () => {
      reject(new Error('timeout'));
    }
    xhr.open('get', url, true)
    xhr.send()
  })
};

const loadPorts = async () => {
  const dropDown = document.querySelector('#port_list');

  const resp = JSON.parse(await request('/ports'));

  if (resp.status != 'ok') {
    result.innerText = resp.msg;
    return;
  }

	if (resp.result.length === 0) {
		dropDown.innerHTML = '<option value="">no port detected</option>';
	}
	else {
    dropDown.innerHTML = '';
		for (const port of resp.result) {
			const newOption = document.createElement("option");

			newOption.text = port.comName;
			if (port["manufacturer"]) {
				newOption.title = port["manufacturer"];
			}
			newOption.value = port.comName;
			dropDown.appendChild(newOption);
		}
	}  
};

const connectPort = async (ev) => {
  const port =  document.querySelector('#port_list').value;

  try {
    const resp = JSON.parse(await request('/open/' + port));
    console.log(resp);
    result.innerText = JSON.stringify(resp);
  }
  catch (error) {
    console.log(error);
    result.innerText = JSON.parse(error);
  }
};

const apiCall = (url) => {
  return async () => {
    try {
      const r = await request(url);
      const resp = JSON.parse(r);
      console.log(resp);
      result.innerText = JSON.stringify(resp);
    }
    catch (error) {
      console.log(error);
      result.innerText = JSON.parse(error);
    }
  }
};

const FN_MAP = {
  '#version': apiCall('/version'),
  '#endstops': apiCall('/endstops'),
  '#message': apiCall('/message/Hello%20Delta'),
  '#refresh_button': loadPorts,
  '#connect_button': connectPort,
  '#disconnect_button': apiCall('/close'),
  '#coords': apiCall('/coords'),
  '#eprom': apiCall('/eprom'),
  '#abort': apiCall('/abort')
};

document.addEventListener("DOMContentLoaded", function() {
  const result = document.querySelector('#result');

  loadPorts();

  for (const selector in FN_MAP) {
    if (FN_MAP.hasOwnProperty(selector)) {
      document.querySelector(selector).onclick = (ev) => {
        ev.preventDefault();
        FN_MAP[selector]();
      }
    }
  }
 

});

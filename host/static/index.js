
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

  const ports = JSON.parse(await request('/ports'));

	if (ports.length === 0) {
		dropDown.innerHTML = '<option value="">no port detected</option>';
	}
	else {
		for (const port of ports) {
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

const getVersion = async (ev) => {
  try {
    const ver = JSON.parse(await request('/version'));
    console.log(ver);
    result.innerText = ver;
  }
  catch (error) {
    console.log(error);
    result.innerText = error.toString();
  }
};

const FN_MAP = {
  '#get_version': getVersion,
  '#refresh_button': loadPorts
};

document.addEventListener("DOMContentLoaded", function() {
  const result = document.querySelector('#result');

  loadPorts();

  for (const selector in FN_MAP) {
    if (FN_MAP.hasOwnProperty(selector)) {
      document.querySelector(selector).onclick = FN_MAP[selector];
    }
  }
 

});

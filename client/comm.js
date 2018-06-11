const communication = (ui) => {
  const baseUrl = 'http://localhost:3000';

  const request = (url, payload = null) => {
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
      };

      xhr.ontimeout = () => {
        reject(new Error('timeout'));
      };

      if (payload) {
        xhr.open('post', baseUrl + url, true);
        xhr.setRequestHeader("Content-type", 'application/json');
      } else {
        xhr.open('get', baseUrl + url, true);
      }

      xhr.send(payload);
    })
  };

  const eh = (fn, data) => {
    return async () => {
      try {
        return await fn(data);
      }
      catch (error) {
        if (error === 0) {
          return {status: 'error', msg: 'Server not started'};
        }

        return {status: 'error', msg: error.toString()};
      }
    }
  };

  return {
    getPorts: eh(async () => {
        return JSON.parse(await request('/ports'));
    }),

    getPoints: eh(async () => {
      return JSON.parse(await request('/testpoints'));
    }),

    closePort: eh(async () => {
      return JSON.parse(await request('/close'));
    }),

    openPort: eh(async (port) => {
      return JSON.parse(await request('/open/port'));
    }),

    getEPROM: eh(async () => {
      return JSON.parse(await request('/eprommock'));
    }),

    probe: eh(async () => {
      return JSON.parse(await request('/probe'));
    }),

    sendCorrections: (data) => { eh(
      async (data) => {
        return JSON.parse(await request('/corrections', JSON.stringify(data)));
      }, data)()},
  };
};

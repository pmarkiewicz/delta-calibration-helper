const communication = () => {
  const baseUrl = 'http://localhost:3000';

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
      };

      xhr.ontimeout = () => {
        reject(new Error('timeout'));
      };

      xhr.open('get', baseUrl + url, true);
      xhr.send();
    })
  };

  const eh = (fn, ...args) => {
    return async () => {
      try {
        return await fn(...args);
      }
      catch (error) {
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
  };
};

const config = {

  startupCode: ['g28', 'm321', 'm322', 'm323 s0', 'g1 x0 y0 z5 f5000'],
  endCode: ['g28'],
  testDistance: 150,
  baudRate: 115200,
  probeSpeed: 800,
  portTimeout: 100 // in tens of sec
};

module.exports = config;
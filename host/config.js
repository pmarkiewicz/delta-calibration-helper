const config = {

  startupCode: ['g28', 'm321', 'm322', 'm323 s0', 'g1 x0 y0 z5 f5000'],
  endCode: ['g28'],
  testDistances: [35, 70],
  baudRate: 115200,
  probeSpeed: 800,
  portTimeout: 10 // in tens of sec
};

module.exports = config;
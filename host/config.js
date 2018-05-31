const config = {

  startupCode: ['g28', 'm321', 'm322', 'm323 s0', 'g1 x0 y0 z5 f5000'],
  endCode: ['g28'],
  testDistances: [35, 70],
  baudRate: 250000
};

module.exports = config;
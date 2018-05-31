//const config = require('./config');
const utils = require('./utils');

const generateTestPoints = (distances) => {
  return distances.reduce((lst, dist) => lst.concat(utils.generatePoints(dist)), [{x: 0, y: 0}]);
};

module.exports = {generateTestPoints};
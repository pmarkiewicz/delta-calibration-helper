//const config = require('./config');
const utils = require('./utils');
const serial = require('./serialUtils');
const EPROM = require('./utils.mock').EPROM;

const generateTestPoints = (distances) => distances.reduce(
  (lst, dist) => lst.concat(utils.generatePoints(dist)), [{x: 0, y: 0}]
);

const getEprom = async () => {
  await serial.sendCommandWithChecksum('M501');

  const eprom = await utils.getResponse();

  return utils.parseEprom(eprom);
};

const getEpromMock = async () => {
  return utils.parseEprom(EPROM);
};


module.exports = {generateTestPoints, getEprom, getEpromMock};
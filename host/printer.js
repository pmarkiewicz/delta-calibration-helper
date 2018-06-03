const config = require('./config');
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

const getPrinterName = async () => {
  await serial.sendCommandWithChecksum('M115');

  return await utils.getResponse();
};

const parseProbeResult = (s) => {
  const re = /[\d:\.\s]+Z-probe:(-?\d+\.\d+)\sX:(-?\d+\.\d+)\sY:(-?\d+\.\d+)/;

  const m = re.exec(s);

  if (!m) {
    throw new Error('Incorrect probing');
  }

  const result = {
    z: parseFloat(m[1]),
    x: parseFloat(m[2]),
    y: parseFloat(m[3])
  }
};

const probePoint = async (pt) => {
  await serial.sendCommandWithChecksum(`G1 X${pt.x} Y${pt.y} F${config.probeSpeed}`);
  await serial.sendCommandWithChecksum('G4 S1');
  await serial.sendCommandWithChecksum('G30');

  const resp = await utils.getResponse();

  return parseProbeResult(resp);
};

const probeList = async (pts) => {
  const res = pts.map(async (pt) => {
    return await probePoint(pt);
  });

  return res;
};

module.exports = {generateTestPoints, getEprom, getEpromMock, getPrinterName, probePoint, probeList};
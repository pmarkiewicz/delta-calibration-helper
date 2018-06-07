const config = require('./config');
const utils = require('./utils');
const serial = require('./serialUtils');
const EPROM = require('./utils.mock').EPROM;
const prepareCmd = require('./printercmd').prepareCmd;

const generateTestPoints = (distances) => distances.reduce(
  (lst, dist) => lst.concat(utils.generatePoints(dist)), [{x: 0, y: 0}]
);

const getEprom = async () => {
  const cmd = prepareCmd('M501');
  const eprom = await serial.sendWithResp('M501');

  return utils.parseEprom(eprom);
};

const getEpromMock = async () => {
  return utils.parseEprom(EPROM);
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
  await serial.sendCommand(`G1 X${pt.x} Y${pt.y} F${config.probeSpeed}`);
  await serial.sendCommand('G4 S1');

  const resp = await serial.sendWithResp(prepareCmd('G30'));

  return parseProbeResult(resp);
};

const probeList = async (pts) => {
  const res = pts.map(async (pt) => {
    return await probePoint(pt);
  });

  return res;
};

const getFirmware = async () => {
  //return "V1";
  try {
    const cmd = prepareCmd('M115');
    const resp = await serial.sendWithResp(cmd);

    return resp.split('\n');
  }
  catch(error) {
    console.log('Prn ERR: ' + error);
    throw error;
  }
};

const getEndstops = async () => {
  try {
    const cmd = prepareCmd('M119');
    const resp = await serial.sendWithResp(cmd);

    return resp;
  }
  catch(error) {
    console.log('Prn ERR: ' + error);
    throw error;
  }
};

const abort = async () => {
  const cmd = prepareCmd('M112');
  const resp = await serial.abort(cmd);

  return resp;
};

module.exports = {abort, generateTestPoints, getEprom, getEpromMock, probePoint, probeList, getFirmware, getEndstops};
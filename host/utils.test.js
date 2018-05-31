const utils = require('./utils');
const EPROM = require('./utils.mock').EPROM;

test('check generated points', () => {
  const coords = utils.generatePoints(70.0);

  expect(coords[0]).toEqual({x: 0, y: 70.0});
  expect(coords[1]).toEqual({x: 0, y: -70.0});
  expect(coords[2].x).toBeCloseTo(60.62);
  expect(coords[2].y).toBeCloseTo(35);
  
});

test('EPROM parser', () => {
  const eprom = utils.parseEprom(EPROM);

  expect(eprom[75]).toBe(250000);
  expect(eprom[1028]).toBe(0);
  expect(eprom[11]).toBe(100);
  expect(eprom[254]).toBe(255);
  
});

test('Checksum', () => {
  expect(utils.checksum('N0 M106')).toBe(36); 
  expect(utils.checksum('N1 G28')).toBe(18); 
  expect(utils.checksum('N2 M107')).toBe(39); 
});

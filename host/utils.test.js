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

  expect(eprom.STEPS_PER_MM).toBe(100.0);
  expect(eprom.X_MIN_POS).toBe(-85.0);
  expect(eprom.X_MAX_LENGTH).toBe(85.0);
  expect(eprom.ALPHA_A).toBe(207.040);
  
});

test('EPROM offset', () => {
  expect(utils.getEpromOffset('STEPS_PER_MM')).toBe(11);
  expect(utils.getEpromOffset('')).toBe(undefined);
  
});


test('Checksum', () => {
  expect(utils.checksum('N0 M106')).toBe(36); 
  expect(utils.checksum('N1 G28')).toBe(18); 
  expect(utils.checksum('G28')).toBe(77); 
  expect(utils.checksum('N2 M107')).toBe(39); 
  expect(utils.checksum('')).toBe(0); 
});

test('Str with checksum', () => {
  expect(utils.strWithChecksum('N0 M106')).toBe('N0 M106*36'); 
  expect(utils.strWithChecksum('N1 G28')).toBe('N1 G28*18'); 
  expect(utils.strWithChecksum('G28')).toBe('G28*77'); 
  expect(utils.strWithChecksum('N2 M107')).toBe('N2 M107*39'); 
  expect(utils.strWithChecksum('')).toBe('*0'); 
});
const printercmd = require('./printercmd');

test('prepare printer command', () => {
  printercmd.reset();
  
  expect(printercmd.prepareCmd('M106')).toBe('N0 M106*36');
  
  expect(printercmd.prepareCmd('M115').replace(/\s/g, '')).toBe('N1 M115*39'.replace(/\s/g, ''));
});

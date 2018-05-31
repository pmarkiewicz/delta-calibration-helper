const printer = require('./printer');
//const config = require('./config');


test('check generated check points', () => {
  const pts = printer.generateTestPoints([35.0, 70.0]);

  expect(pts[0]).toEqual({x: 0, y: 0});
  expect(pts[1]).toEqual({x: 0, y: 35});
  expect(pts[2].x).toBeCloseTo(0.0);
  expect(pts[2].y).toBeCloseTo(-35.0);
  expect(pts[3].x).toBeCloseTo(30.31);
  expect(pts[3].y).toBeCloseTo(17.50);
  expect(pts[7]).toEqual({x: 0, y: 70});
});
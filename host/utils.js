const parseEprom = (s) => {
  const re = /\d?\d:\d?\d:\d?\d\.\d+\s+:\s+EPR:(\d)\s+(\d+)\s+(\-?\d+(?:\.\d+)?)/;
  const data = s.split('\n');

  const params = data.reduce((lst, item) => {
    const m = re.exec(item);

    if (m) {
      const typeId = parseInt(m[1])
      const offset = parseInt(m[2]);
      const value = typeId === 3 ? parseFloat(m[3]) : parseInt(m[3]);

      if (typeId !== undefined && value !== undefined) {
				lst[offset] = value;
			}
    }

    return lst;
  }, {});

  return params;
};

const generatePoints = (dist) => {
// generates 6 points around zero
  const rotationInRad = 60.0 * Math.PI / 180.0;

  xCoord = dist * Math.sin(rotationInRad);
  yCoord = dist * Math.cos(rotationInRad);

  return [{x: 0, y: dist}, {x: 0, y: -dist},
          {x: xCoord, y: yCoord}, {x: xCoord, y: -yCoord},
          {x: -xCoord, y: yCoord}, {x: -xCoord, y: -yCoord}];
};

const checksum = (s) => {
// gcode checksum
// byte checksum = 0; byte count = 0; while(instruction[count] != '*') checksum = checksum^instruction[count++];

  const result = s.split('').reduce((sum, ch) => {
    return (sum ^ ch.charCodeAt(0)) & 0xFF;
  }, 0);

  return result;
};
module.exports = {parseEprom, generatePoints, checksum};

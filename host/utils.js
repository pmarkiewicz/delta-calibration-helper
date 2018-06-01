
// map numers to names, non-existing items are not added to output
const EPROM_MAP = {
  11:	  'STEPS_PER_MM',
  133:	'X_MIN_POS',  
  137:	'Y_MIN_POS',
  141:	'Z_MIN_POS',
  145:	'X_MAX_LENGTH',
  149:	'Y_MAX_LENGTH',
  153:	'Z_MAX_LENGTH',
  881:	'DIAGONAL_ROD_LENGTH',
  885:	'HORIZONTAL_ROD_RADIUS',
  925:	'MAX_PRINTABLE_RADIUS',
  893:	'TOWER_X_ENDSTOP_OFFSET',
  895:	'TOWER_Y_ENDSTOP_OFFSET',
  897:	'TOWER_Z_ENDSTOP_OFFSET',
  901:	'ALPHA_A',
  905:	'ALPHA_B',
  909:	'ALPHA_C',
  913:	'DELTA_RADIUS_A',
  917:	'DELTA_RADIUS_B',
  921:	'DELTA_RADIUS_C',
  933:	'CORR_DIAGONAL_A',
  937:	'CORR_DIAGONAL_B',
  941:	'CORR_DIAGONAL_C',
  808:	'Z-PROBE_HEIGHT_MM',
  929:	'MAX_Z_PROBE_BED_DIST',
  812:	'Z-PROBE_SPEED',
  800:  'Z-PROBE_OFFSET X',
  804:  'Z-PROBE_OFFSET Y',
  1036:	'Z-PROBE_BENDING CORRECTION_A',
  1040:	'Z-PROBE_BENDING CORRECTION_B',
  1044:	'Z-PROBE_BENDING CORRECTION_C',
  976:	'TAN_XY_AXIS COMPENSATION',
  980:	'TAN_YZ_AXIS COMPENSATION',
  984:	'TAN_XZ_AXIS COMPENSATION'
};

const parseEprom = (s) => {
  const re = /\d?\d:\d?\d:\d?\d\.\d+\s+:\s+EPR:(\d)\s+(\d+)\s+(\-?\d+(?:\.\d+)?)/;
  const data = s.split('\n');

  const params = data.reduce((lst, item) => {
    const m = re.exec(item);

    if (m) {
      const typeId = parseInt(m[1])
      const offset = parseInt(m[2]);
      const value = typeId === 3 ? parseFloat(m[3]) : parseInt(m[3]);
      const key = EPROM_MAP[offset];

      if (typeId !== undefined && value !== undefined) {
				lst[key] = value;
			}
    }

    return lst;
  }, {});

  return params;
};

const generatePoints = (dist) => {
// generates 6 points around zero
  const rotationInRad = 60.0 * Math.PI / 180.0;

  const xCoord = dist * Math.sin(rotationInRad);
  const yCoord = dist * Math.cos(rotationInRad);

  return [{x: 0, y: dist}, {x: 0, y: -dist},
          {x: xCoord, y: yCoord}, {x: xCoord, y: -yCoord},
          {x: -xCoord, y: yCoord}, {x: -xCoord, y: -yCoord}];
};

const checksum = (s) => {
// gcode checksum
// byte checksum = 0; byte count = 0; while(instruction[count] != '*') checksum = checksum^instruction[count++];

  const result = s.split('').reduce((sum, ch) => (sum ^ ch.charCodeAt(0)) & 0xFF, 0);

  return result;
};

const strWithChecksum = (s) => {
  const chksum = checksum(s);

  return `${s}*${chksum}`;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {parseEprom, generatePoints, checksum, strWithChecksum, sleep};

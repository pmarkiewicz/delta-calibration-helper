const strWithChecksum = require('./utils').strWithChecksum;

// command counter, state
let cmdNo = 1;  

const reset = () => { 
  cmdNo = 0; 
}

const prepareCmd = (cmd) => {
  const fullcmd = `N${cmdNo} ${cmd}`;
  cmdNo += 1;

  return strWithChecksum(fullcmd);
}

module.exports = {prepareCmd, reset};

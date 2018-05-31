// popup.js
document.querySelector('#copy_button').addEventListener('click', (ev) => {
  ev.preventDefault();
  document.querySelector('#script').value = calibrationScript;
  document.querySelector('#script').select();
  document.execCommand('copy');
  document.querySelector('#message_box').innerHTML = '<span style="color:red">Script copied into clipboard</span>';
});

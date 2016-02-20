const dirname = require('path').dirname;
const hook = require('.');
const seekout = require('seekout');

const preset = seekout('cmrh.conf.js', dirname(module.parent.filename));
if (!preset) {
  throw new Error('Unable to find cmrh.conf.js');
}

hook(require(preset));

const debug = require('debug')('css-modules:preset');
const dirname = require('path').dirname;
const hook = require('.');
const seekout = require('seekout');

debug('→ cmrh.conf.js');
const preset = seekout('cmrh.conf.js', dirname(module.parent.filename));

if (!preset) {
  debug('failure');
  return void hook({});
}

debug('success');
hook(require(preset));

const hook = require('.');
const lookup = require('lookup-fs');

// should it be a sync call?
lookup('cmrh.conf.js', module.parent.filename, (er, cssModulesFilePath) => {
  if (er) {
    throw new Error('Unable to find cmrh.conf.js');
  }

  const preset = require(cssModulesFilePath);
  hook(preset);
});

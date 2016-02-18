const hook = require('.');
const lookup = require('lookup-fs');

lookup('cmrh.conf.js', (err, cssModulesFilePath) => {
  if (err) {
    throw new Error('Unable to find css-modules-file.js');
  }

  hook(require(cssModulesFilePath));
});

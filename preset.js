const hook = require('.');
const lookup = require('lookup-fs');

lookup('css-modules-file.js', (err, cssModulesFilePath) => {
  if (err) {
    throw new Error('Unable to find css-modules-file.js');
  }

  hook(require(cssModulesFilePath));
});

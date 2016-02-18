const rules = {
  // hook
  extensions:         'array|string',
  preprocessCss:      'function',
  processCss:         'function',
  to:                 'string',
  // plugins
  append:             'array',
  prepend:            'array',
  use:                'array',
  createImportedName: 'function',
  generateScopedName: 'function|string',
  mode:               'string',
  rootDir:            'string',
};

module.exports = function validate(options) {}

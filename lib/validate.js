const difference = require('lodash').difference;
const forEach = require('lodash').forEach;
const keys = require('lodash').keys;

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

const tests = {
  array:    require('lodash').isArray,
  function: require('lodash').isFunction,
  string:   require('lodash').isString,
};

module.exports = function validate(options) {
  const unknownOptions = difference(keys(options), keys(rules));
  if (unknownOptions.length) {
    throw new Error(`unknown arguments: ${unknownOptions.join(', ')}.`);
  }

  forEach(rules, (types, rule) => {
    if (typeof options[rule] === 'undefined') {
      return;
    }

    if (!types.split('|').some(type => tests[type](options[rule]))) {
      throw new TypeError(`should specify ${types} as ${rule}`);
    }
  });
}

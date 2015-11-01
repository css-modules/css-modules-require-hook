import forEach from 'lodash.foreach';
import { is } from './utility';
import { format } from 'util';

const rules = {
  // hook
  extensions:         'array',
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

export default function validate(options = {}) {
  forEach(rules, (types, rule) => {
    if (!options[rule]) {
      return;
    }

    if (!types.split('|').some(type => is(type, options[rule]))) {
      throw new Error(format('should specify %s for the %s', types, rule));
    };
  });
}

'use strict';

if (global._cssModulesPolyfill) {
  throw new Error('only one instance of css-modules/polyfill is allowed');
}

global._cssModulesPolyfill = true;

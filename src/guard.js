if (global._cssModulesPolyfill) {
  throw new Error('only one instance of css-modules-require-hook is allowed');
}

global._cssModulesPolyfill = true;

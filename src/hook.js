'use strict';

/**
 * @param {function} compile
 */
module.exports = function (compile) {
  require.extensions['.css'] = function (m, filename) {
    var tokens = compile(filename);
    return m._compile('module.exports = ' + JSON.stringify(tokens), filename);
  };
};

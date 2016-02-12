/**
 * @param {function} compile
 * @param {string}   extension
 */
module.exports = function attachHook(compile, extension) {
  require.extensions[extension] = function cssModulesHook(m, filename) {
    const tokens = compile(filename);
    return m._compile(`module.exports = ${JSON.stringify(tokens)}`, filename);
  };
};

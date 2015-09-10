/**
 * @param {function} compile
 * @param {string} extension
 */
export default function attachHook(compile, extension) {
  require.extensions[extension] = function hook(m, filename) {
    const tokens = compile(filename);
    return m._compile('module.exports = ' + JSON.stringify(tokens), filename);
  };
}

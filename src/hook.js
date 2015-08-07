/**
 * @param {function} compile
 */
export default function attachHook(compile) {
  require.extensions['.css'] = function hook(m, filename) {
    const tokens = compile(filename);
    return m._compile('module.exports = ' + JSON.stringify(tokens), filename);
  };
}

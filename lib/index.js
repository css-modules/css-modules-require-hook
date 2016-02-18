const assign = require('lodash').assign;
const attachHook = require('./attachHook');
const dirname = require('path').dirname;
const genericNames = require('generic-names');
const identity = require('lodash').identity;
const readFileSync = require('fs').readFileSync;
const relative = require('path').relative;
const resolve = require('path').resolve;
const validate = require('./validate');

const postcss = require('postcss');
const Values = require('postcss-modules-values');
const LocalByDefault = require('postcss-modules-local-by-default');
const ExtractImports = require('postcss-modules-extract-imports');
const Scope = require('postcss-modules-scope');
const Parser = require('postcss-modules-parser');

module.exports = function setupHook({
  extensions = '.css',
  preprocessCss = identity,
  processCss,
  to,
  append = [],
  prepend = [],
  createImportedName,
  generateScopedName,
  mode,
  use,
  rootDir: context = process.cwd(),
}) {
  validate(arguments[0]);

  const tokensByFile = {};

  let scopedName;
  if (generateScopedName) {
    scopedName = typeof generateScopedName !== 'function'
      ? genericNames(generateScopedName || '[name]__[local]___[hash:base64:5]', {context})
      : generateScopedName;
  } else {
    // small fallback
    scopedName = (local, filename) => {
      return Scope.generateScopedName(local, relative(context, filename));
    };
  }

  const plugins = (use || [
    ...prepend,
    Values,
    mode
      ? new LocalByDefault({mode})
      : LocalByDefault,
    createImportedName
      ? new ExtractImports({createImportedName})
      : ExtractImports,
    new Scope({generateScopedName: scopedName}),
    ...append,
  ]).concat(new Parser({fetch})); // no pushing in order to avoid the possible mutations;

  // https://github.com/postcss/postcss#options
  const runner = postcss(plugins);

  // https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts

  /**
   * @todo   think about replacing sequential fetch function calls with requires calls
   * @param  {string} _to
   * @param  {string} from
   * @return {object}
   */
  function fetch(_to, from) {
    // getting absolute path to the processing file
    const filename = /\w/i.test(_to[0])
      ? require.resolve(_to)
      : resolve(dirname(from), _to);

    // checking cache
    let tokens = tokensByFile[filename];
    if (tokens) {
      return tokens;
    }

    const source = preprocessCss(readFileSync(filename, 'utf8'), filename);
    // https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts
    const lazyResult = runner.process(source, assign({}, {from: filename}));

    // https://github.com/postcss/postcss/blob/master/docs/api.md#lazywarnings
    lazyResult.warnings().forEach(message => console.warn(message.text));

    tokens = lazyResult.root.tokens;

    if (processCss) {
      processCss(lazyResult.css, filename);
    }

    return tokens;
  };

  attachHook(filename => fetch(filename, filename), '.css', () => false);
};

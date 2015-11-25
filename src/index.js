import assign from 'lodash.assign';
import debug from 'debug';
import hook from './hook';
import identity from 'lodash.identity';
import extractor from './extractor';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import validate from './validate';
import './guard';

// cache
let tokensByFile = {};
// global
let instance = extractor({}, fetch);
let processorOptions = {};
let preProcess = identity;
let postProcess;

const debugFetch = debug('css-modules:fetch');
const debugSetup = debug('css-modules:setup');

/**
 * @param  {array}    options.extensions
 * @param  {function} options.preprocessCss
 * @param  {function} options.processCss
 * @param  {string}   options.to
 * @param  {object}   options.rest
 */
export default function setup({ extensions: extraExtensions, preprocessCss, processCss, to, ...rest } = {}) {
  debugSetup(arguments[0]);
  validate(arguments[0]);
  instance = extractor(rest, fetch);
  processorOptions = {to};
  preProcess = preprocessCss || identity;
  postProcess = processCss || null;
  // clearing cache
  tokensByFile = {};

  if (extraExtensions) {
    extraExtensions.forEach((extension) => hook(filename => fetch(filename, filename), extension));
  }
}

/**
 * @param  {string} to   Absolute or relative path. Also can be path to the Node.JS module.
 * @param  {string} from Absolute path.
 * @return {object}
 */
function fetch(to, from) {
  // getting absolute path to the processing file
  const filename = /\w/i.test(to[0])
    ? require.resolve(to)
    : resolve(dirname(from), to);

  // checking cache
  let tokens = tokensByFile[filename];
  if (tokens) {
    debugFetch({cache: true, filename});
    return tokens;
  }

  debugFetch({cache: false, filename});
  const CSSSource = preProcess(readFileSync(filename, 'utf8'), filename);
  // https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts
  const lazyResult = instance.process(CSSSource, assign(processorOptions, {from: filename}));

  // https://github.com/postcss/postcss/blob/master/docs/api.md#lazywarnings
  lazyResult.warnings().forEach(message => console.warn(message.text));

  // updating cache
  tokens = lazyResult.root.tokens;
  tokensByFile[filename] = tokens;

  if (postProcess) {
    postProcess(lazyResult.css, filename);
  }

  return tokens;
}

hook(filename => fetch(filename, filename), '.css');

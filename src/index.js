import hook from './hook';
import { readFileSync } from 'fs';
import { dirname, sep, relative, resolve } from 'path';
import { get, removeQuotes } from './utility';
import assign from 'lodash.assign';
import identity from 'lodash.identity';
import pick from 'lodash.pick';
import postcss from 'postcss';

import ExtractImports from 'postcss-modules-extract-imports';
import LocalByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';
import Parser from './parser';

// cache
let importNr = 0;
let tokensByFile = {};
// processing functions
let preProcess = identity;
let postProcess;
// defaults
let lazyResultOpts = {};
let plugins = [LocalByDefault, ExtractImports, Scope];
let rootDir = process.cwd();

/**
 * @param  {object}   opts
 * @param  {function} opts.createImportedName
 * @param  {function} opts.generateScopedName
 * @param  {function} opts.preprocessCss
 * @param  {function} opts.processCss
 * @param  {string}   opts.rootDir
 * @param  {string}   opts.to
 * @param  {array}    opts.use
 * @param  {array}    opts.extensions
 */
export default function setup(opts = {}) {
  // clearing cache
  importNr = 0;
  tokensByFile = {};

  preProcess = get('preprocessCss', null, 'function', opts) || identity;
  postProcess = get('processCss', null, 'function', opts) || null;
  rootDir = get('rootDir', ['root', 'd'], 'string', opts) || process.cwd();
  // https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts
  lazyResultOpts = pick(opts, ['to']);

  const extraExtensions = get('extensions', null, 'array', opts);
  if (extraExtensions) {
    extraExtensions.forEach((extension) => {
      hook(filename => fetch(filename, filename), extension);
    });
  }

  // Warning. Options, which aren't affected by plugins, should be processed above.
  const customPlugins = get('use', ['u'], 'array', opts);
  if (customPlugins) {
    return void (plugins = customPlugins);
  }

  plugins = [];

  const mode = get('mode', null, 'string', opts);
  plugins.push(mode
    ? new LocalByDefault({mode: opts.mode})
    : LocalByDefault);

  const createImportedName = get('createImportedName', null, 'function', opts);
  plugins.push(createImportedName
    ? new ExtractImports({createImportedName: opts.createImportedName})
    : ExtractImports);

  const generateScopedName = get('generateScopedName', null, 'function', opts);
  plugins.push(generateScopedName
    ? new Scope({generateScopedName: opts.generateScopedName})
    : Scope);
}

/**
 * @param  {string} _to    Absolute or relative path. Also can be path to the Node.JS module.
 * @param  {string} _from  Absolute path (relative to root).
 * @param  {string} _trace
 * @return {object}
 */
function fetch(_to, _from, _trace) {
  const trace = _trace || String.fromCharCode(importNr++);
  const newPath = removeQuotes(_to);
  // getting absolute path to the processing file
  const filename = /\w/.test(newPath[0])
    ? require.resolve(newPath)
    : resolve(dirname(_from), newPath);

  // checking cache
  let tokens = tokensByFile[filename];
  if (tokens) {
    return tokens;
  }

  const rootRelativePath = sep + relative(rootDir, filename);
  const CSSSource = preProcess(readFileSync(filename, 'utf8'), filename);

  const lazyResult = postcss(plugins.concat(new Parser({ fetch, filename, trace })))
    .process(CSSSource, assign(lazyResultOpts, {from: rootRelativePath}));

  lazyResult.warnings().forEach(message => console.warn(message.text));

  tokens = lazyResult.root.tokens;
  // updating cache
  tokensByFile[filename] = tokens;

  if (postProcess) {
    postProcess(lazyResult.css, filename);
  }

  return tokens;
}

hook(filename => fetch(filename, filename), '.css');

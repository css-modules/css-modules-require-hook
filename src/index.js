import hook from './hook';
import { readFileSync } from 'fs';
import { dirname, sep, relative, resolve } from 'path';
import { get, removeQuotes } from './utility';
import identity from 'lodash.identity';
import postcss from 'postcss';

import ExtractImports from 'postcss-modules-extract-imports';
import LocalByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';
import Parser from './parser';

// cache
let importNr = 0;
let tokensByFile = {};
// processing functions
const preProcess = identity;
let postProcess;
// defaults
let plugins = [LocalByDefault, ExtractImports, Scope];
let rootDir = process.cwd();

/**
 * @param  {object}   opts
 * @param  {function} opts.createImportedName
 * @param  {function} opts.generateScopedName
 * @param  {function} opts.processCss
 * @param  {string}   opts.rootDir
 * @param  {array}    opts.use
 */
export default function setup(opts = {}) {
  // clearing cache
  importNr = 0;
  tokensByFile = {};

  postProcess = get('processCss', null, 'function', opts) || null;
  rootDir = get('rootDir', ['root', 'd'], 'string', opts) || process.cwd();

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
 * @param  {string} _newPath    Absolute or relative path. Also can be path to the Node.JS module.
 * @param  {string} _sourcePath Absolute path (relative to root).
 * @param  {string} _trace
 * @return {object}
 */
function fetch(_newPath, _sourcePath, _trace) {
  const trace = _trace || String.fromCharCode(importNr++);
  const newPath = removeQuotes(_newPath);
  // getting absolute path to the processing file
  const filename = /\w/.test(newPath[0])
    ? require.resolve(newPath)
    : resolve(rootDir + dirname(_sourcePath), newPath);

  // checking cache
  let tokens = tokensByFile[filename];
  if (tokens) {
    return tokens;
  }

  const rootRelativePath = sep + relative(rootDir, filename);
  const CSSSource = preProcess(readFileSync(filename, 'utf8'));

  const result = postcss(plugins.concat(new Parser({ fetch, trace })))
    .process(CSSSource, {from: rootRelativePath})
    .root;

  tokens = result.tokens;
  tokensByFile[filename] = tokens;

  if (postProcess) {
    postProcess(result.toResult().css);
  }

  return tokens;
}

hook(filename => fetch(filename, sep + relative(rootDir, filename)));

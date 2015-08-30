import hook from './hook';
import { readFileSync } from 'fs';
import { dirname, sep, relative, resolve } from 'path';
import { identity, removeQuotes } from './fn';
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

  if (opts.processCss && typeof opts.processCss !== 'function') {
    throw new Error('should specify function for processCss');
  }

  postProcess = opts.processCss || null;

  if (opts.rootDir && typeof opts.rootDir !== 'string') {
    throw new Error('should specify string for rootDir');
  }

  rootDir = opts.rootDir || process.cwd();

  if (opts.use) {
    if (!Array.isArray(opts.use)) {
      throw new Error('should specify array for use');
    }

    return void (plugins = opts.use);
  }

  plugins = [];

  if (opts.mode) {
    if (typeof opts.mode !== 'string') {
      throw new Error('should specify string for mode');
    }

    plugins.push(new LocalByDefault({mode: opts.mode}));
  } else {
    plugins.push(LocalByDefault);
  }

  if (opts.createImportedName) {
    if (typeof opts.createImportedName !== 'function') {
      throw new Error('should specify function for createImportedName');
    }

    plugins.push(new ExtractImports({createImportedName: opts.createImportedName}));
  } else {
    plugins.push(ExtractImports);
  }

  if (opts.generateScopedName) {
    if (typeof opts.generateScopedName !== 'function') {
      throw new Error('should specify function for generateScopedName');
    }

    plugins.push(new Scope({generateScopedName: opts.generateScopedName}));
  } else {
    plugins.push(Scope);
  }
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

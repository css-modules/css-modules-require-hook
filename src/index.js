import './guard';
import hook from './hook';
import postcss from 'postcss';
import { dirname, join, parse, relative, resolve, sep } from 'path';
import { readFileSync } from 'fs';
import isPlainObject from 'lodash.isplainobject';

import ExtractImports from 'postcss-modules-extract-imports';
import LocalByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';
import Parser from './parser';

let processCss;
let rootDir;
let plugins;

/**
 * @param  {object}   opts
 * @param  {function} opts.generateScopedName
 * @param  {function} opts.processCss|.p
 * @param  {string}   opts.rootDir|.root|.d
 * @param  {array}    opts.use|.u
 */
export default function buildOptions(opts = {}) {
  if (!isPlainObject(opts)) {
    throw new Error('Use plain object');
  }

  processCss = get(opts, 'processCss|p');
  rootDir = get(opts, 'rootDir|root|d');
  rootDir = rootDir ? resolve(rootDir) : process.cwd();

  const customPlugins = get(opts, 'use|u');
  if (Array.isArray(customPlugins)) {
    return void (plugins = customPlugins);
  }

  plugins = [];

  plugins.push(
    opts.mode
      ? new LocalByDefault({mode: opts.mode})
      : LocalByDefault
  );

  plugins.push(
    opts.createImportedName
      ? new ExtractImports({createImportedName: opts.createImportedName})
      : ExtractImports
  );

  plugins.push(
    opts.generateScopedName
      ? new Scope({generateScopedName: opts.generateScopedName})
      : Scope
  );
}

const escapedSeparator = sep.replace(/(.)/g, '\\$1');
const relativePathPattern = new RegExp(`^.{1,2}$|^.{1,2}${escapedSeparator}`);
const tokensByFile = {};
let importNr = 0;

/**
 * @param  {object} object
 * @param  {string} keys 'a|b|c'
 * @return {*}
 */
function get(object, keys) {
  let key;

  keys.split('|').some(k => {
    if (!object[k]) {
      return false;
    }

    key = k;
    return true;
  });

  return key ? object[key] : null;
}

/**
 * @param  {string}  pathname
 * @return {boolean}
 */
function isModule(pathname) {
  const parsed = parse(pathname);
  return !parsed.root && !relativePathPattern.test(parsed.dir);
}

/**
 * @param  {string}   sourceString The file content
 * @param  {string}   sourcePath
 * @param  {string}   trace
 * @param  {function} pathFetcher
 * @return {object}
 */
function load(sourceString, sourcePath, trace, pathFetcher) {
  const lazyResult = postcss(plugins.concat(new Parser({ pathFetcher, trace })))
    .process(sourceString, {from: sourcePath});

  return { injectableSource: lazyResult.css, exportTokens: lazyResult.root.tokens };
}

/**
 * @param  {string} _newPath
 * @param  {string} _relativeTo
 * @param  {string} _trace
 * @return {object}
 */
function fetch(_newPath, _relativeTo, _trace) {
  const newPath = _newPath.replace(/^["']|["']$/g, '');
  const trace = _trace || String.fromCharCode(importNr++);

  const relativeDir = dirname(_relativeTo);
  const rootRelativePath = resolve(relativeDir, newPath);
  let fileRelativePath = resolve(join(rootDir, relativeDir), newPath);

  if (isModule(newPath)) {
    fileRelativePath = require.resolve(newPath);
  }

  const tokens = tokensByFile[fileRelativePath];
  if (tokens) {
    return tokens;
  }

  const source = readFileSync(fileRelativePath, 'utf-8');
  const { exportTokens, injectableSource } = load(source, rootRelativePath, trace, fetch);

  tokensByFile[fileRelativePath] = exportTokens;

  if (typeof processCss === 'function') {
    processCss(injectableSource);
  }

  return exportTokens;
}

// setting defaults
buildOptions();

hook(filename => fetch(`.${sep}${relative(rootDir, filename)}`, '/'));

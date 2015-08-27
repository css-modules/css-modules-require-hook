import './guard';
import hook from './hook';
import postcss from 'postcss';
import { dirname, join, parse, relative, resolve, sep } from 'path';
import { readFileSync } from 'fs';

import ExtractImports from 'postcss-modules-extract-imports';
import LocalByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';
import Parser from './parser';

const escapedSeparator = sep.replace(/(.)/g, '\\$1');
const relativePathPattern = new RegExp(`^.{1,2}$|^.{1,2}${escapedSeparator}`);

const defaultRoot = process.cwd();
const tokensByFile = {};
let plugins = [LocalByDefault, ExtractImports, Scope];
let root = defaultRoot;
let importNr = 0;

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

  return { injectableSource: lazyResult.css, exportTokens: lazyResult.root.tokens };;
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
  let fileRelativePath = resolve(join(root, relativeDir), newPath);

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

  return exportTokens;
}

hook(filename => fetch(`.${sep}${relative(root, filename)}`, '/'));

/**
 * @param  {object} opts
 * @param  {array}  opts.u
 * @param  {array}  opts.use
 */
export default function configure(opts = {}) {
  const customPlugins = opts.u || opts.use;
  plugins = Array.isArray(customPlugins)
    ? customPlugins
    : [LocalByDefault, ExtractImports, Scope];

  root = opts.root && typeof opts.root === 'string'
    ? opts.root
    : defaultRoot;
}

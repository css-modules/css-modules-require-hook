'use strict';

import './guard';
import hook from './hook';
import postcss from 'postcss';
import { basename, dirname, join, relative, resolve } from 'path';
import { readFileSync } from 'fs';

import ExtractImports from 'postcss-modules-extract-imports';
import LocalByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';
import Parser from './parser';

let plugins = [LocalByDefault, ExtractImports, Scope];
let rootDir;

/**
 * @param  {string}   sourceString The file content
 * @param  {string}   sourcePath
 * @param  {string}   trace
 * @param  {function} pathFetcher
 * @return {object}
 */
function load(sourceString, sourcePath, trace, pathFetcher) {
  let result = postcss(plugins.concat(new Parser({ pathFetcher, trace })))
    .process(sourceString, {from: sourcePath})
    .root;

  return result.tokens;
}

hook(filename => {
  const root = rootDir || dirname(filename);
  const tokensByFile = {};
  let importNr = 0;

  const fetch = (_newPath, _relativeTo, _trace) => {
    let newPath = _newPath.replace(/^["']|["']$/g, '');
    let trace = _trace || String.fromCharCode(importNr++);

    let relativeDir = dirname(_relativeTo);
    let rootRelativePath = resolve(relativeDir, newPath);
    let fileRelativePath = resolve(join(root, relativeDir), newPath);

    const tokens = tokensByFile[fileRelativePath];
    if (tokens) {
      return tokens;
    }

    let source = readFileSync(fileRelativePath, 'utf-8');
    let exportTokens = load(source, rootRelativePath, trace, fetch);

    tokensByFile[fileRelativePath] = exportTokens;

    return exportTokens;
  }

  return fetch(relative(root, filename), '/');
});

/**
 * @param  {object} opts
 * @param  {array}  opts.u
 * @param  {array}  opts.use
 */
export default function configure(opts) {
  opts = opts || {};

  let customPlugins = opts.u || opts.use;
  plugins = Array.isArray(customPlugins)
    ? customPlugins
    : [LocalByDefault, ExtractImports, Scope];

  if (opts.root && typeof opts.root === 'string') {
    rootDir = opts.root;
  }
}

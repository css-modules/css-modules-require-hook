'use strict';

import './guard';
import hook from './hook';
import postcss from 'postcss';
import { basename, dirname, join, relative, resolve } from 'path';
import { readFileSync } from 'fs';

import extractImports from 'postcss-modules-extract-imports';
import localByDefault from 'postcss-modules-local-by-default';
import scope from 'postcss-modules-scope';
import parser from './parser';

let plugins = [localByDefault, extractImports, scope];
let rootDir;

/**
 * @param  {string}   sourceString The file content
 * @param  {string}   sourcePath
 * @param  {string}   trace
 * @param  {function} pathFetcher
 * @return {object}
 */
function load(sourceString, sourcePath, trace, pathFetcher) {
  let result = postcss(plugins.concat(new parser({ pathFetcher, trace })))
    .process(sourceString, {from: '/' + sourcePath})
    .root;

  return { injectableSource: result.css, exportTokens: result.tokens };
}

hook(filename => {
  const root = rootDir || dirname(filename);
  const sources = {};
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
    let { injectableSource, exportTokens } = load(source, rootRelativePath, trace, fetch);

    sources[trace] = injectableSource;
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
    : [localByDefault, extractImports, scope];

  if (opts.root && typeof opts.root === 'string') {
    rootDir = opts.root;
  }
}

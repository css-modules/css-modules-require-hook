import hook from './hook';
import { readFileSync } from 'fs';
import { dirname, sep, relative, resolve } from 'path';
import postcss from 'postcss';

import ExtractImports from 'postcss-modules-extract-imports';
import LocalByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';
import Parser from './parser';

let plugins = [ExtractImports, LocalByDefault, Scope];
let rootDir = process.cwd();

export default function (opts = {}) {
  plugins = opts.use ? opts.use : [ExtractImports, LocalByDefault, Scope];
  rootDir = opts.root ? opts.root : process.cwd();
}

function pathFetcher(_newPath, sourcePath, trace) {
  const newPath = _newPath.replace(/^["']|["']$/g, '');
  const filename = /\w/.test(newPath[0])
    ? require.resolve(newPath)
    : resolve(rootDir + dirname(sourcePath), newPath);
  const rootRelativePath = sep + relative(rootDir, filename);
  const source = readFileSync(filename, 'utf-8');

  const result = postcss(plugins.concat(new Parser({ pathFetcher })))
    // preprocess
    .process(source, {from: rootRelativePath})
    .root;
    // postprocess

  return result.tokens;
}

hook(filename => pathFetcher(filename, sep + relative(rootDir, filename)));

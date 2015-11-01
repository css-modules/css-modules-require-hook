import postcss from 'postcss';
import genericNames from 'generic-names';
import { relative } from 'path';

import Values from 'postcss-modules-values';
import LocalByDefault from 'postcss-modules-local-by-default';
import ExtractImports from 'postcss-modules-extract-imports';
import Scope from 'postcss-modules-scope';
import Parser from './parser';

/**
 * @param  {array}           options.append
 * @param  {array}           options.prepend
 * @param  {array}           options.use
 * @param  {function}        options.createImportedName
 * @param  {function|string} options.generateScopedName
 * @param  {string}          options.mode
 * @param  {string}          options.rootDir
 * @param  {function}        fetch
 * @return {object}
 */
export default function extractor({
  append = [],
  prepend = [],
  createImportedName,
  generateScopedName,
  mode,
  use,
  rootDir: context = process.cwd(),
} = {}, fetch) {
  let scopedName;
  if (generateScopedName) {
    scopedName = typeof generateScopedName !== 'function'
      ? genericNames(generateScopedName || '[name]__[local]___[hash:base64:5]', {context})
      : generateScopedName;
  } else {
    // small fallback
    scopedName = (local, filename) => Scope.generateScopedName(local, relative(context, filename));
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
  ]).concat(new Parser({fetch})); // no pushing in order to avoid the possible mutations

  return postcss(plugins);
}

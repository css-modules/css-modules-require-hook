import postcss from 'postcss';
import genericNames from 'generic-names';

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
  if (typeof generateScopedName !== 'function') {
    generateScopedName = genericNames(generateScopedName || '[name]__[local]___[hash:base64:5]', {context});
  }

  const plugins = use || [
    ...prepend,
    Values,
    mode
      ? new LocalByDefault({mode})
      : LocalByDefault,
    createImportedName
      ? new ExtractImports({createImportedName})
      : ExtractImports,
    new Scope({generateScopedName}),
    ...append,
  ];

  plugins.push(new Parser({fetch}));
  return postcss(plugins);
}

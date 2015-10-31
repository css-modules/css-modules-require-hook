import { plugin } from 'postcss';
import forEach from 'lodash.foreach';
import replaceSymbols from 'icss-replace-symbols';
const importRegexp = /^:import\((.+)\)$/;
const exportRegexp = /^:export$/;

/**
 * @param  {function} options.fetch
 * @return {function}
 */
export default plugin('parser', function parser({ fetch } = {}) {
  return css => {
    // https://github.com/postcss/postcss/blob/master/docs/api.md#inputfile
    const file = css.source.input.file;
    const translations = {};
    const exportTokens = {};

    css.walkRules(importRegexp, rule => {
      const exports = fetch(RegExp.$1, file);

      rule.walkDecls(decl => translations[decl.prop] = exports[decl.value]);
      rule.remove();
    });

    replaceSymbols(css, translations);

    css.walkRules(exportRegexp, rule => {
      rule.walkDecls(decl => {
        forEach(translations, (value, key) => decl.value = decl.value.replace(key, value));
        exportTokens[decl.prop] = decl.value;
      });

      rule.remove();
    });

    css.tokens = exportTokens;
  };
});

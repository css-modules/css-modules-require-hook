'use strict';

import { plugin } from 'postcss';

const importRegexp = /^:import\((.+)\)$/

export default plugin('parser', function (opts) {
  opts = opts || {};

  let exportTokens = opts.exportTokens;
  let translations = {};

  const fetchImport = (importNode, relativeTo, depNr) => {
    let file = importNode.selector.match( importRegexp )[1];
    let depTrace = opts.trace + String.fromCharCode(depNr);
    let exports = opts.pathFetcher(file, relativeTo, depTrace);

    importNode.each(decl => {
      if (decl.type === 'decl') {
        translations[decl.prop] = exports[decl.value];
      }
    });

    importNode.removeSelf();
  }

  const fetchAllImports = css => {
    let imports = 0;

    css.each(node => {
      if (node.type === 'rule' && node.selector.match(importRegexp)) {
        fetchImport(node, css.source.input.from, imports++);
      }
    });
  }

  const linkImportedSymbols = css => css.eachDecl(decl => {
    Object.keys(translations).forEach(translation => {
      decl.value = decl.value.replace(translation, translations[translation])
    });
  });

  const handleExport = exportNode => {
    exportNode.each(decl => {
      if (decl.type === 'decl') {
        Object.keys(translations).forEach(translation => {
          decl.value = decl.value.replace(translation, translations[translation])
        });

        exportTokens[decl.prop] = decl.value;
      }
    });

    exportNode.removeSelf();
  }

  const extractExports = css => css.each(node => {
    if (node.type === 'rule' && node.selector === ':export') handleExport(node);
  });

  return css => {
    fetchAllImports(css);
    linkImportedSymbols(css);
    extractExports(css);
  }
});

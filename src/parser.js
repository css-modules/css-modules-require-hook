'use strict';

import Parser from 'css-modules-loader-core/lib/parser';

class SyncParser extends Parser {
  plugin(css, result) {
    this.fetchAllImports(css);
    this.linkImportedSymbols(css);
    this.extractExports(css);
  }

  fetchImport(importNode, relativeTo, depNr) {
    let file = importNode.selector.match( importRegexp )[1];
    let depTrace = this.trace + String.fromCharCode(depNr);
    let exp = this.pathFetcher(file, relativeTo, depTrace);

    importNode.each(decl => {
      if (decl.type === 'decl') {
        this.translations[decl.prop] = exports[decl.value]
      }
    });

    importNode.removeSelf();
  }

  fetchImport( importNode, relativeTo, depNr ) {
    let file = importNode.selector.match( importRegexp )[1],
      depTrace = this.trace + String.fromCharCode(depNr)
    return this.pathFetcher( file, relativeTo, depTrace ).then( exports => {
      importNode.each( decl => {
        if ( decl.type == 'decl' ) {
          this.translations[decl.prop] = exports[decl.value]
        }
      } )
      importNode.removeSelf()
    }, err => console.log( err ) )
  }
}

export default SyncParser;

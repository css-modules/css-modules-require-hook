import { dropCache } from '../utils/sugar';
import { equal } from 'assert';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { extend } from 'lodash';
import FileSystemLoader from 'css-modules-loader-core/lib/file-system-loader';
import hook from '../src';

const normalize = str => str.replace(/\r\n?/g, '\n');
const pipelines = {
  'test-cases': undefined,
  'cssi': [],
};

let expectedCSS;
let expectedTokens;

describe('common-test-cases', () => {

  describe('test-cases', () => {

    describe('compose node module', () => {
      before(() => {
        dropCache(resolve('test/test-cases/compose-node-module/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/test-cases/compose-node-module/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/compose-node-module/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/test-cases'), use: pipelines['test-cases']});
      });

      it.skip('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/test-cases'), pipelines['test-cases']);

        loader.fetch('compose-node-module/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/test-cases/compose-node-module/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

    describe('extra extension', () => {
      before(() => {
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/extra-extension/expected.json'), 'utf8'));
        hook({extensions: ['.scss']});
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/test-cases/extra-extension/source.scss'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });

    });

    describe('localise export', () => {
      before(() => {
        dropCache(resolve('test/test-cases/localise-export/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/test-cases/localise-export/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/localise-export/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/test-cases'), use: pipelines['test-cases']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/test-cases'), pipelines['test-cases']);

        loader.fetch('localise-export/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/test-cases/localise-export/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

    describe('multiple dependencies', () => {
      before(() => {
        dropCache(resolve('test/test-cases/multiple-dependencies/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/test-cases/multiple-dependencies/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/multiple-dependencies/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/test-cases'), use: pipelines['test-cases']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/test-cases'), pipelines['test-cases']);

        loader.fetch('multiple-dependencies/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/test-cases/multiple-dependencies/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

    describe('multiple sources', () => {
      before(() => {
        dropCache(resolve('test/test-cases/multiple-sources/source1.css'));
        dropCache(resolve('test/test-cases/multiple-sources/source2.css'));
        expectedCSS = normalize(readFileSync(resolve('test/test-cases/multiple-sources/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/multiple-sources/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/test-cases'), use: pipelines['test-cases']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/test-cases'), pipelines['test-cases']);

        loader.fetch('multiple-sources/source1.css', '/').then(tokens1 => {
          loader.fetch('multiple-sources/source2.css', '/').then(tokens2 => {
            equal(loader.finalSource, expectedCSS);
            const tokens = extend({}, tokens1, tokens2);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          }).then(done, done);
        }).catch(done);
      });

      it('require-hook', () => {
        const tokens = extend({},
          require(resolve('test/test-cases/multiple-sources/source1.css')),
          require(resolve('test/test-cases/multiple-sources/source2.css'))
        );

        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

    describe('simple export', () => {
      before(() => {
        dropCache(resolve('test/test-cases/simple-export/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/test-cases/simple-export/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/simple-export/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/test-cases'), use: pipelines['test-cases']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/test-cases'), pipelines['test-cases']);

        loader.fetch('simple-export/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/test-cases/simple-export/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

    describe('single import export', () => {
      before(() => {
        dropCache(resolve('test/test-cases/single-import-export/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/test-cases/single-import-export/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/single-import-export/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/test-cases'), use: pipelines['test-cases']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/test-cases'), pipelines['test-cases']);

        loader.fetch('single-import-export/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/test-cases/single-import-export/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

    describe('values', () => {
      before(() => {
        dropCache(resolve('test/test-cases/values/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/test-cases/values/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/test-cases/values/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/test-cases'), use: pipelines['test-cases']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/test-cases'), pipelines['test-cases']);

        loader.fetch('values/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/test-cases/values/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

  });

  describe('cssi', () => {

    describe('interchange format', () => {
      before(() => {
        dropCache(resolve('test/cssi/interchange-format/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/cssi/interchange-format/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/cssi/interchange-format/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/cssi'), use: pipelines['cssi']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/cssi'), pipelines['cssi']);

        loader.fetch('interchange-format/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/cssi/interchange-format/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

    describe('pseudo variables', () => {
      before(() => {
        dropCache(resolve('test/cssi/pseudo-variables/source.css'));
        expectedCSS = normalize(readFileSync(resolve('test/cssi/pseudo-variables/expected.css'), 'utf8'));
        expectedTokens = JSON.parse(readFileSync(resolve('test/cssi/pseudo-variables/expected.json'), 'utf8'));
        hook({rootDir: resolve('test/cssi'), use: pipelines['cssi']});
      });

      it('loader-core', done => {
        const loader = new FileSystemLoader(resolve('test/cssi'), pipelines['cssi']);

        loader.fetch('pseudo-variables/source.css', '/')
          .then(tokens => {
            equal(loader.finalSource, expectedCSS);
            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          })
          .then(done, done);
      });

      it('require-hook', () => {
        const tokens = require(resolve('test/cssi/pseudo-variables/source.css'));
        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    });

  });

});

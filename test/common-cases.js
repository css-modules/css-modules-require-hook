import { equal } from 'assert';
import { extend, mapKeys } from 'lodash';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import FileSystemLoader from 'css-modules-loader-core/lib/file-system-loader';
import hook from '../src';

const normalize = str => str.replace(/\r\n?/g, '\n');
const pipelines = {
  'test-cases': undefined,
  'cssi': [],
};

let expectedCSS;
let expectedTokens;

mapKeys(pipelines, (plugins, dirname) => describe(dirname, () => {
  const cases = join(__dirname, dirname);

  readdirSync(cases).forEach(testCase => {
    if (existsSync(join(cases, testCase, 'source.css'))) {
      describe(`should ${testCase.replace(/-/g, ' ')}`, () => {
        before(() => {
          hook({rootDir: cases, use: plugins});
          expectedCSS = normalize(readFileSync(join(cases, testCase, 'expected.css'), 'utf-8'));
          expectedTokens = JSON.parse(readFileSync(join(cases, testCase, 'expected.json'), 'utf-8'));
        });

        it('loader-core', done => {
          const loader = new FileSystemLoader(cases, pipelines[dirname]);

          loader.fetch(`${testCase}/source.css`, '/')
            .then(tokens => {
              equal(loader.finalSource, expectedCSS);
              equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
            })
            .then(done, done);
        });

        it('require-hook', () => {
          const tokens = require(join(cases, testCase, 'source.css'));
          equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
        });
      });
    }

    if (existsSync(join(cases, testCase, 'source1.css'))) {
      describe(`should ${testCase.replace(/-/g, ' ')}`, () => {
        before(() => {
          hook({rootDir: cases, use: plugins});
          expectedCSS = normalize(readFileSync(join(cases, testCase, 'expected.css'), 'utf-8'));
          expectedTokens = JSON.parse(readFileSync(join(cases, testCase, 'expected.json'), 'utf-8'));
        });

        it('loader-core', done => {
          const loader = new FileSystemLoader(cases, pipelines[dirname]);

          loader.fetch(`${testCase}/source1.css`, '/').then(tokens1 => {
            loader.fetch(`${testCase}/source2.css`, '/').then(tokens2 => {
              equal(loader.finalSource, expectedCSS);
              const tokens = extend({}, tokens1, tokens2);
              equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
            }).then(done, done);
          }).catch(done);
        });

        it('require-hook', () => {
          const tokens = extend({},
            require(join(cases, testCase, 'source1.css')),
            require(join(cases, testCase, 'source2.css')));

          equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
        });
      });
    }
  });
}));

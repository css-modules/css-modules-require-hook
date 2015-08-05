'use strict';

import fs from 'fs'
import path from 'path'
import { equal } from 'assert';

import hook from '../';

const pipelines = {
  'test-cases': undefined,
  'cssi': []
}

describe('css-modules-require-hook', function () {
  Object.keys(pipelines).forEach(dirname => {
    describe(dirname, () => {
      let testDir = path.join(__dirname, dirname);

      fs.readdirSync(testDir).forEach(testCase => {
        if (fs.existsSync(path.join(testDir, testCase, 'source.css'))) {
          it('should ' + testCase.replace(/-/g, ' '), () => {
            hook({
              root: testDir,
              use: pipelines[dirname]
            });

            let expectedTokens = JSON.parse(fs.readFileSync(path.join(testDir, testCase, 'expected.json'), 'utf-8'));
            let tokens = require(`${testDir}/${testCase}/source.css`);

            equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
          });
        }
      });
    });
  });

  // special case for testing multiple sources
  describe('multiple sources', () => {
    let testDir = path.join(__dirname, 'test-cases');
    let testCase = 'multiple-sources';
    let dirname = 'test-cases';

    if (fs.existsSync(path.join(testDir, testCase, 'source1.css'))) {
      it('should ' + testCase.replace(/-/g, ' '), () => {
        hook({
          root: testDir,
          use: pipelines[dirname]
        });

        let expectedTokens = JSON.parse(fs.readFileSync(path.join(testDir, testCase, 'expected.json'), 'utf-8'));
        let tokens1 = require(`${testDir}/${testCase}/source1.css`);
        let tokens2 = require(`${testDir}/${testCase}/source2.css`);
        let tokens = Object.assign({}, tokens1, tokens2);

        equal(JSON.stringify(tokens), JSON.stringify(expectedTokens));
      });
    }
  });
});

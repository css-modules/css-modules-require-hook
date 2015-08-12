import { equal } from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';
import hook from '../src';

describe('css-modules-require-hook', () => {
  describe('without options', () => {
    before(hook);

    it('should return tokens', () => {
      const expectedTokens = JSON.parse(readFileSync(join(__dirname, './cases/simple/expected.json'), 'utf8'));
      const tokens = require('./cases/simple/source.css');

      equal(JSON.stringify(expectedTokens), JSON.stringify(tokens));
    });
  });

  describe('non-relative imports', () => {
    it('should resolve to node_modules', () => {
      const expectedTokens = JSON.parse(readFileSync(join(__dirname, './cases/non-relative-imports/expected.json'), 'utf8'));
      const tokens = require('./cases/non-relative-imports/source.css');

      equal(JSON.stringify(expectedTokens), JSON.stringify(tokens));
    });
  });
});

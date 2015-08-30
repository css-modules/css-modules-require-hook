import { equal } from 'assert';
import { identity } from 'lodash';
import hook from '../src';

describe('plugins', () => {
  describe('custom generateScopedName() function', () => {
    before(() => {
      hook({generateScopedName: identity});
    });

    it('tokens should have the same generated names', () => {
      const tokens = require('awesome-theme/oceanic.css');
      equal(tokens.color, 'color');
    });
  });
});

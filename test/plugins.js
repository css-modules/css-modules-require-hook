import { equal } from 'assert';
import { identity } from 'lodash';
import hook from '../src';

import ExtractImports from 'postcss-modules-extract-imports';
import LocalByDefault from 'postcss-modules-local-by-default';
import Scope from 'postcss-modules-scope';

describe('plugins', () => {
  beforeEach(() => {
    // clearing cache
    delete require.cache[require.resolve('awesome-theme/oceanic.css')];
  });

  describe('custom generateScopedName() function', () => {
    before(() => hook({generateScopedName: identity}));

    it('tokens should have the same generated names', () => {
      const tokens = require('awesome-theme/oceanic.css');
      equal(tokens.color, 'color');
    });
  });

  describe('explicit way to set generateScopedName() function', () => {
    before(() => hook({
      use: [
        ExtractImports,
        LocalByDefault,
        new Scope({generateScopedName: identity}),
      ],
    }));

    it('tokens should have the same generated names', () => {
      const tokens = require('awesome-theme/oceanic.css');
      equal(tokens.color, 'color');
    });
  });
});

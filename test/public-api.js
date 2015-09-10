import { constant } from 'lodash';
import { equal, ok } from 'assert';
import hook from '../src';

describe('public api', () => {
  beforeEach(() => {
    // clearing cache
    delete require.cache[require.resolve('awesome-theme/oceanic.css')];
  });

  describe('preprocessCss', () => {
    describe('providing empty string constantly', () => {
      before(() => hook({preprocessCss: constant('')}));

      it('should return an empty result', () => {
        const tokens = require('awesome-theme/oceanic.css');
        equal(Object.keys(tokens).length, 0);
      });
    });

    describe('providing nothing should reset preProcess', () => {
      before(() => hook());

      it('should return the "color" token', () => {
        const tokens = require('awesome-theme/oceanic.css');
        ok(tokens.color);
      });
    });
  });
});

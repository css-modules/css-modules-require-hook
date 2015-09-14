import { constant } from 'lodash';
import { equal, ok } from 'assert';
import hook from '../src';

describe('public api', () => {
  beforeEach(() => {
    // clearing cache
    delete require.cache[require.resolve('awesome-theme/oceanic.css')];
  });

  describe('preprocessCss()', () => {
    describe('content of the file and filename are provided to the preprocessCss function', () => {
      let providedCSS;
      let providedFilename;

      beforeEach(() => {
        const spy = (content, filename) => {
          providedCSS = content;
          providedFilename = filename;
          return content;
        };

        hook({preprocessCss: spy});
        require('awesome-theme/oceanic.css');
      });

      it('content of file should be provided', () => {
        equal(typeof providedCSS, 'string');
        ok(providedCSS.length);
      });

      it('filename should be provided', () => {
        equal(providedFilename, require.resolve('awesome-theme/oceanic.css'));
      });
    });

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

  describe('processCss()', () => {
    let providedCSS;
    let providedFilename;

    beforeEach(() => {
      const spy = (content, filename) => {
        providedCSS = content;
        providedFilename = filename;
        return content;
      };

      hook({processCss: spy});
      require('awesome-theme/oceanic.css');
    });

    it('content of file should be provided', () => {
      equal(typeof providedCSS, 'string');
      ok(providedCSS.length);
    });

    it('filename should be provided', () => {
      equal(providedFilename, require.resolve('awesome-theme/oceanic.css'));
    });
  });
});

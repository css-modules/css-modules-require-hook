import { equal } from 'assert';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { dropCache } from '../utils/sugar';
import hook from '../src';

const fixture = join(__dirname, 'fixture/dynamic.css');

function updateFile(content) {
  writeFileSync(fixture, content, 'utf8');
}

describe('development mode', () => {
  describe('should cache calls not in development mode', () => {
    before(() => {
      hook();
      updateFile('.block\n{\n  display: block;\n}');
      process.env.NODE_ENV = '';
      require(fixture);
      updateFile('.inline-block\n{\n  display: inline-block;\n}');
    });

    after(() => {
      process.env.NODE_ENV = '';
      dropCache(fixture);
    });

    it('should retrive data from cache', () => {
      const tokens = require(fixture);
      const keys = Object.keys(tokens);
      equal(keys.length, 1);
      equal(keys.join(''), 'block');
    });
  });

  describe('should clear cache in development mode', () => {
    before(() => {
      hook();
      updateFile('.block\n{\n  display: block;\n}');
      process.env.NODE_ENV = 'development';
      require(fixture);
      updateFile('.inline-block\n{\n  display: inline-block;\n}');
    });

    after(() => {
      process.env.NODE_ENV = '';
      dropCache(fixture);
    });

    it('should retrive data from fs', () => {
      const tokens = require(fixture);
      const keys = Object.keys(tokens);
      equal(keys.length, 1);
      equal(keys.join(''), 'inline-block');
    });
  });
});

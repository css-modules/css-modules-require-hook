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
  describe('shouldn`t calls cache in development mode', () => {
    describe('devMode:false options should override NODE_ENV="development"', () => {
      before(() => {
        hook({ devMode: false });
        updateFile('.block\n{\n  display: block;\n}');
        process.env.NODE_ENV = 'development';
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

    describe('should cache calls without any options', () => {
      before(() => {
        hook();
        updateFile('.block\n{\n  display: block;\n}');
        require(fixture);
        updateFile('.inline-block\n{\n  display: inline-block;\n}');
      });

      after(() => {
        dropCache(fixture);
      });

      it('should retrive data from cache', () => {
        const tokens = require(fixture);
        const keys = Object.keys(tokens);
        equal(keys.length, 1);
        equal(keys.join(''), 'block');
      });
    });
  });

  describe('should clear cache in development mode', () => {
    describe('devMode:true option should works without NODE_ENV="development"', () => {
      before(() => {
        hook({ devMode: true });
        updateFile('.block\n{\n  display: block;\n}');
        require(fixture);
        updateFile('.inline-block\n{\n  display: inline-block;\n}');
      });

      after(() => {
        dropCache(fixture);
      });

      it('should retrive data from fs', () => {
        const tokens = require(fixture);
        const keys = Object.keys(tokens);
        equal(keys.length, 1);
        equal(keys.join(''), 'inline-block');
      });
    });

    describe('NODE_ENV="development" should works without debug:true option', () => {
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
});

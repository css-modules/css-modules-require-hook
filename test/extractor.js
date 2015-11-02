import { equal } from 'assert';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import hook from '../src';

describe('extractor', () => {
  let selector;

  before(() => {
    hook({generateScopedName: '[name]__[local]___[hash:base64:5]'});
    execSync('npm run fixture', {cwd: process.cwd()});
    selector = readFileSync(resolve('test/cases/webpack/result.css'), 'utf8')
      .split('\n').shift().replace(/^\./, '');
  });

  it('should generate the same selectors as the webpack does', () => {
    const tokens = require('./cases/webpack/source.css');
    equal(selector, tokens.local);
  });
});

'use strict';

const {camelizeDashes, transformTokens} = require('../../lib/transformTokens');

suite('lib/transformTokens', () => {
  test('camelizeDashes', () => {
    assert.equal(camelizeDashes(''), '');
    assert.equal(camelizeDashes('a-a'), 'aA');
    assert.equal(camelizeDashes('a-a-b'), 'aAB');
    assert.equal(camelizeDashes('a-'), 'a-');
  });

  suite('transformTokens', () => {
    test('`true -> should transform all the keys to CC, keeps original keys', () => {
      assert.deepEqual(transformTokens({
        'k-e-bab': 'kebab case',
        's_na_ke': 'snake case',
        'simple': 'aaa',
      }, true), {
        'k-e-bab': 'kebab case',
        's_na_ke': 'snake case',
        'simple': 'aaa',
        'kEBab': 'kebab case',
        'sNaKe': 'snake case',
      });
    });

    test('`dashes` -> should transform the keys with dashed, keeps original keys', () => {
      assert.deepEqual(transformTokens({
        'k-e-bab': 'kebab case',
        's_na_ke': 'snake case',
        'simple': 'aaa',
      }, 'dashes'), {
        'k-e-bab': 'kebab case',
        's_na_ke': 'snake case',
        'simple': 'aaa',
        'kEBab': 'kebab case',
      });
    });

    test('`dashesOnly` -> should transform only keys with dashes', () => {
      assert.deepEqual(transformTokens({
        'k-e-bab': 'kebab case',
        's_na_ke': 'snake case',
        'simple': 'aaa',
      }, 'dashesOnly'), {
        's_na_ke': 'snake case',
        'simple': 'aaa',
        'kEBab': 'kebab case',
      });
    });

    test('`only` -> should camelize keys', () => {
      assert.deepEqual(transformTokens({
        'k-e-bab': 'kebab case',
        's_na_ke': 'snake case',
        'simple': 'aaa',
      }, 'only'), {
        'simple': 'aaa',
        'kEBab': 'kebab case',
        'sNaKe': 'snake case',
      });
    });
  });
});

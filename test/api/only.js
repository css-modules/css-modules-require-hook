const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;

suite('api/only', () => {
  suite('glob', () => {
    setup(() => hook({
      only: '*typography*',
    }));

    test('should return tokens', () => {
      assert.deepEqual(require('./fixture/typography.css'), {
        common: '_test_api_fixture_typography__common',
      });
    });

    test('should throw an exception', () => {
      assert.throws(() => require('./fixture/oceanic.css'));
    });
  });

  suite('function', () => {
    setup(() => hook({
      only: filename => !/typography/.test(filename),
    }));

    test('should return tokens', () => {
      assert.throws(() => require('./fixture/typography.css'));
    });

    test('should throw an exception', () => {
      assert.deepEqual(require('./fixture/oceanic.css'), {
        color: '_test_api_fixture_oceanic__color',
      });
    });
  });

  suite('regex', () => {
    setup(() => hook({
      only: /\.(?!css$)/,
    }));

    test('should throw an exception', () => {
      assert.throws(() => require('./fixture/typography.css'));
      assert.throws(() => require('./fixture/oceanic.css'));
    });
  });

  teardown(() => {
    detachHook('.css');
    dropCache('./api/fixture/oceanic.css');
    dropCache('./api/fixture/typography.css');
  });
});

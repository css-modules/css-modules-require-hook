const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;

suite('api/camelCase', () => {
  test('should add camel case keys in token', () => {
    const tokens = require('./fixture/bem.css');
    assert.deepEqual(tokens, {
      blockElementModifier: '_test_api_fixture_bem__block__element--modifier',
      'block__element--modifier': '_test_api_fixture_bem__block__element--modifier',
    });
  });

  setup(() => hook({ camelCase: true }));

  teardown(() => {
    detachHook('.css');
    dropCache('./api/fixture/bem.css');
  });
});

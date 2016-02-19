const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;

suite('css-modules-require-hook/preset', () => {
  setup(() => require('../../preset'));

  test('should return tokens', () => {
    const tokens = require('./fixture/oceanic.css');
    assert.deepEqual(tokens, {});
  });

  teardown(() => {
    detachHook('.css');
    dropCache('./preset/fixture/oceanic.css');
  });
});

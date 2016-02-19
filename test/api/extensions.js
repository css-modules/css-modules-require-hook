const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const identity = require('lodash').identity;

suite('api/extensions', () => {
  suite('uses .css by default', () => {
    test('should provide tokens', () => {
      const tokens = require('./fixture/oceanic.css');
      assert(tokens);
    });

    setup(() => hook({}));

    teardown(() => {
      detachHook('.css');
      dropCache('./api/fixture/oceanic.css');
    });
  });
});

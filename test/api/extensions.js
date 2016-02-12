const dropCache = require('../sugar').dropCache;
const dropHook = require('../sugar').dropHook;
const identity = require('lodash').identity;
const spy = require('sinon').spy;

suite('api/extensions', () => {
  suite('uses .css by default', () => {
    test('should provide tokens', () => {
      const tokens = require('./fixture/oceanic.css');
      assert(tokens);
    });

    setup(() => hook({}));

    teardown(() => {
      dropCache('./api/fixture/oceanic.css');
      dropHook('.css');
    });
  });
});

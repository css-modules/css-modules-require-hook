const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const identity = require('lodash').identity;

suite('api/preprocessCss', () => {
  const preprocessCss = spy(identity);

  test('should be called', () => assert(preprocessCss.called));

  setup(() => {
    hook({preprocessCss});
    require('./fixture/oceanic.css');
  });

  teardown(() => {
    dropCache('./api/fixture/oceanic.css');
    detachHook('.css');
  });
});

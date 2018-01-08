const {detachHook, dropCache} = require('../sugar');
const path = require('path');

suite('api/resolve', () => {
  test('should be called', () => {
    const tokens = require('./fixture/shortcuts.css');

    assert.deepEqual(tokens, {
      color: '_test_api_fixture_shortcuts__color _test_api_fixture_oceanic__color',
    });
  });

  setup(() => {
    hook({resolve: {
      modules: [path.join(__dirname, 'fixture')],
    }});
  });

  teardown(() => {
    detachHook('.css');
    dropCache('./api/fixture/oceanic.css');
  });
});

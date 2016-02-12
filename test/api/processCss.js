const dropCache = require('../sugar').dropCache;
const identity = require('lodash').identity;
const spy = require('sinon').spy;

suite('api/processCss()', () => {
  const processCss = spy(identity);

  test('should be called', () => assert(processCss.called));

  setup(() => {
    hook({processCss: processCss});
    require('./fixture/oceanic.css');
  });

  teardown(() => dropCache('./api/fixture/oceanic.css'));
});

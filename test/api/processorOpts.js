const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;
const identity = require('lodash').identity;

const lessParser = require('postcss-less').parse;

// https://github.com/postcss/postcss/blob/master/docs/api.md#processorprocesscss-opts
suite('api/processorOpts()', () => {
  test('should provide possibility to specify custom processor options, for example: parser', () => {
    const tokens = require('./fixture/oceanic.less');
    assert.deepEqual(tokens, {color: '_test_api_fixture_oceanic__color'});
  });

  setup(() => {
    hook({
      extensions: '.less',
      processorOpts: {parser: lessParser},
    });
  });

  teardown(() => {
    detachHook('.less');
    dropCache('./api/fixture/oceanic.less');
  });
});

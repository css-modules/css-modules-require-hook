const detachHook = require('../sugar').detachHook;
const dropCache = require('../sugar').dropCache;

suite('api/hashPrefix', () => {
  let samples = [];

  suite('using string pattern and hashPrefix', () => {
    let tokens;

    test('should return tokens with prefixed id', () => assert.deepEqual(tokens, {
      color: 'oceanic__color___3xlBZ',
    }));

    setup(() => {
      hook({generateScopedName: '[name]__[local]___[hash:base64:5]', hashPrefix: 'test'});
      tokens = require('./fixture/oceanic.css');
      samples.push(tokens);
    });
  });

  suite('using string pattern', () => {
    let tokens;

    test('should return tokens with different hashes', () => assert.notDeepEqual(
      samples
    ));

    setup(() => {
      hook({generateScopedName: '[name]__[local]___[hash:base64:5]'});
      tokens = require('./fixture/oceanic.css');
      samples.push(tokens);
    });
  });

  teardown(() => {
    detachHook('.css');
    dropCache('./api/fixture/oceanic.css');
  });
});

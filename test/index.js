describe('css-modules-require-hook', function () {
  'use strict';

  var assert = require('assert');
  var styles;

  before(function (done) {
    // loading hook
    require('..');

    try {
      styles = require('./example.css');
      done();
    } catch(e) {
      done(e);
    }
  });

  it('loaded an object from "example.css" as a module', function () {
    assert.strictEqual(typeof styles, 'object');
  });

  it('module has the "app" key', function () {
    assert(styles.hasOwnProperty('app'));
  });

  it('the value of the "app" key is not an empty string', function () {
    assert.strictEqual(typeof styles.app, 'string', 'app\'s value is not a string');
    assert(styles.app, 'app contains an empty string');
  });
});

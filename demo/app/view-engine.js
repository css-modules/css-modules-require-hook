'use strict';

const babel = require('babel-core/register');
const lodash = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom/server');

const doctype = '<!doctype html>';

/**
 * @param {object} view
 */
function dropCache(view) {
  const detectView = new RegExp(`^${view}`);

  lodash.forEach(require.cache, (view, identity) => {
    detectView.test(view.filename)
      && delete require.cache[identity];
  });
}

babel({
  only: /components/,
});

/**
 * @param {string}   file
 * @param {object}   opts
 * @param {function} cb
 */
module.exports = function viewEngine(file, opts, cb) {
  let markup = doctype;

  try {
    let component = require(file).default;
    markup += ReactDOM.renderToStaticMarkup(
      React.createElement(component, opts)
    );
  } catch (e) {
    dropCache(opts.settings.views);
    return void cb(e);
  }

  dropCache(opts.settings.views);
  cb(null, markup);
};

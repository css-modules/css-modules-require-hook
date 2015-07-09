'use strict';

if (global._cssModulesPolyfill) {
  throw new Error('only one instance of css-modules/polyfill is allowed');
}

global._cssModulesPolyfill = true;

var assign = require('object-assign');
var options = {};

/**
 * Posibility to pass custom options to the module
 * @param {object} opts
 */
module.exports = function (opts) {
  assign(options, opts);
};

var Core = require('css-modules-loader-core');
var pluginsCache;

/**
 * Caching plugins for the future calls
 * @return {array}
 */
function loadPlugins() {
  // retrieving from cache if they are already loaded
  if (pluginsCache) {
    return pluginsCache;
  }

  // PostCSS plugins passed to FileSystemLoader
  var plugins = options.use || options.u;
  if (!plugins) {
    plugins = Core.defaultPlugins;
  } else {
    if (typeof plugins === 'string') {
      plugins = [ plugins ];
    }

    plugins = plugins.map(function requirePlugin (name) {
      // assume functions are already required plugins
      if (typeof name === 'function') {
        return name;
      }

      var plugin = require(require.resolve(name));

      // custom scoped name generation
      if (name === 'postcss-modules-scope') {
        options[name] = options[name] || {};
        options[name].generateScopedName = createScopedNameFunc(plugin);
      }

      if (name in options) {
        plugin = plugin(options[name]);
      } else {
        plugin = plugin.postcss || plugin();
      }

      return plugin;
    });
  }

  return pluginsCache = plugins;
}

var FileSystemLoader = require('css-modules-loader-core/lib/file-system-loader');
var path = require('path');

require.extensions['.css'] = function (m, filename) {
  var plugins = loadPlugins();
  var loader = new FileSystemLoader(path.dirname(filename), plugins);
  var tokens = loader.fetchSync(path.basename(filename), '/');

  return m._compile('module.exports = ' + JSON.stringify(tokens), filename);
};

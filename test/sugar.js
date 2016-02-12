/**
 * Drops require cache for the certain module
 *
 * @param {string} modulePath
 */
function dropCache(modulePath) {
  delete require.cache[require.resolve(modulePath)];
};

/**
 * @param  {string} extension
 */
function dropHook(extension) {
  delete require.extensions[extension];
}

exports.dropCache = dropCache;
exports.dropHook = dropHook;

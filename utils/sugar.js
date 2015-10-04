import { identity } from 'lodash';
import { plugin } from 'postcss';

/**
 * @param {string} moduleName
 */
export function dropCache(moduleName) {
  delete require.cache[require.resolve(moduleName)];
}

/**
 * @param  {function} fn
 * @return {function}
 */
export function spy(fn) {
  const wrapper = function wrapper() {
    wrapper.called = true;
    wrapper.times++;
    return fn.apply(this, arguments);
  };

  wrapper.called = false;
  wrapper.times = 0;

  return wrapper;
}

/**
 * Simple PostCSS plugin for the test purpose
 * @param  {object} opts
 * @return {Function}
 */
export const Through = plugin('through', function through(opts = {}) {
  const processor = opts.processor || identity;
  return css => processor(css);
});

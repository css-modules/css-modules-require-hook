'use strict';

const setupHookCore = require('./setupHook');
const attachHook = require('./attachHook');

module.exports = function setupHook(params) {
  setupHookCore(params, attachHook);
}

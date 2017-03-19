'use strict';

const {assign, camelCase, reduce} = require('lodash');

const camelizeKeys = (acc, value, key) => {
  const camelizedKey = camelCase(key);
  if (camelizedKey !== key) acc[camelizedKey] = value;
  return acc;
};

const camelizeDashedKeys = (acc, value, key) => {
  const camelizedKey = camelizeDashes(key);
  if (camelizedKey !== key) acc[camelizedKey] = value;
  return acc;
};

exports.camelizeDashes = camelizeDashes;
exports.transformTokens = transformTokens;

/**
 * @param  {string} str
 * @return {string}
 */
function camelizeDashes(str) {
  return str.replace(/-(\w)/g, (m, letter) => letter.toUpperCase());
}

/**
 * @param  {object} tokens
 * @param  {boolean|string} camelCase 'dashes|dashesOnly|only'
 * @return {object}
 */
function transformTokens(tokens, camelCase) {
  switch (camelCase) {
  case true:
    return reduce(tokens, camelizeKeys, assign({}, tokens));

  case 'dashes':
    return reduce(tokens, camelizeDashedKeys, assign({}, tokens));

  case 'dashesOnly':
    return reduce(tokens, camelizeDashedKeys, {});

  case 'only':
    return reduce(tokens, camelizeKeys, {});
  }

  return tokens;
}

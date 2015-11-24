import isArray from 'lodash.isarray';
import isFunction from 'lodash.isfunction';
import isString from 'lodash.isstring';

const check = {
  'array':    isArray,
  'function': isFunction,
  'string':   isString,
};

/**
 * @param  {string}  type
 * @param  {*}       value
 * @return {boolean}
 */
export function is(type, value) {
  return check[type](value);
}

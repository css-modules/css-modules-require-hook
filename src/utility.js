import isArray from 'lodash.isarray';
import isFunction from 'lodash.isfunction';
import isString from 'lodash.isstring';
import { format } from 'util';

const check = {
  'array': isArray,
  'function': isFunction,
  'string': isString,
};

/**
 * @param  {string} prop
 * @param  {string[]} aliases
 * @param  {string} type
 * @param  {object} source
 * @return {*}
 */
export function get(prop, aliases, type, source) {
  if (source[prop]) {
    if (isArray(type)) {
      if (type.some(tp => is(tp, source[prop]))) {
        return source[prop];
      }

      throw new Error(format('should specify %s for %s', type.join('|'), prop));
    }

    if (!is(type, source[prop])) {
      throw new Error(format('should specify %s for %s', type, prop));
    }

    return source[prop];
  }

  if (!isArray(aliases)) {
    return null;
  }

  let deprecatedProp;
  const match = aliases.some(alias => Boolean(source[(deprecatedProp = alias)]));

  if (match) {
    if (!is(type, source[deprecatedProp])) {
      throw new Error(format('should specify %s for %s', type, deprecatedProp));
    }

    // deprecated message
    return source[deprecatedProp];
  }

  return null;
}

/**
 * @param  {string}  type
 * @param  {*}       value
 * @return {boolean}
 */
export function is(type, value) {
  return check[type](value);
}

/**
 * @param  {string} str
 * @return {string}
 */
export function removeQuotes(str) {
  return str.replace(/^["']|["']$/g, '');
}

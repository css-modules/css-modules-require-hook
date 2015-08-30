/**
 * @param  {*} a
 * @return {*}
 */
export function identity(a) {
  return a;
}

/**
 * @param  {string} str
 * @return {string}
 */
export function removeQuotes(str) {
  return str.replace(/^["']|["']$/g, '');
}

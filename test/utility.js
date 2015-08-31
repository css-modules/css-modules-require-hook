import { ok, equal, throws } from 'assert';
import { get, is, removeQuotes } from '../src/utility';

describe('utility', () => {
  describe('get()', () => {
    it('should return value for an existing property', () => equal(get('a', null, 'string', {a: 'val'}), 'val'));

    it('should return value for an existing alias', () => equal(get('a', ['b'], 'string', {b: 'val'}), 'val'));

    it('should return null for a non-existing property', () => equal(get('a', null, 'array', {}), null));

    it('should throw an error for the specified key with wrong type of value', () => {
      throws(() => get('a', null, 'string', {a: 5}));
    });
  });

  describe('is()', () => {
    it('should return true for an array', () => ok(is('array', [])));

    it('should return false for not an array', () => ok(!is('array', null)));

    it('should return true for a function', () => ok(is('function', () => {})));

    it('should return false for not a function', () => ok(!is('function', null)));

    it('should return true for a string', () => ok(is('string', '')));

    it('should return false for not a string', () => ok(!is('string', null)));
  });

  describe('removeQuotes()', () => {
    it('should remove quotes', () => equal(removeQuotes('"TEST"'), 'TEST'));
  });
});

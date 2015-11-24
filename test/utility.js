import { ok } from 'assert';
import { is } from '../src/utility';

describe('utility', () => {
  describe('is()', () => {
    it('should return true for an array', () => ok(is('array', [])));

    it('should return false for not an array', () => ok(!is('array', null)));

    it('should return true for a function', () => ok(is('function', () => {})));

    it('should return false for not a function', () => ok(!is('function', null)));

    it('should return true for a string', () => ok(is('string', '')));

    it('should return false for not a string', () => ok(!is('string', null)));
  });
});

import { describe, it, expect } from '@jest/globals';
import { isStrongPassword } from '../../utils/validators';

describe('Password Strength Validator', () => {
  describe('isStrongPassword', () => {
    it('should reject password without uppercase letter', () => {
      expect(isStrongPassword('weakpass123!')).toBe(false);
    });

    it('should reject password without lowercase letter', () => {
      expect(isStrongPassword('WEAKPASS123!')).toBe(false);
    });

    it('should reject password without number', () => {
      expect(isStrongPassword('WeakPass!')).toBe(false);
    });

    it('should reject password without special character', () => {
      expect(isStrongPassword('WeakPass123')).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      expect(isStrongPassword('Wp1!')).toBe(false);
    });

    it('should accept strong password with all requirements', () => {
      expect(isStrongPassword('StrongPass123!')).toBe(true);
    });

    it('should accept password with various special characters', () => {
      expect(isStrongPassword('Pass123@')).toBe(true);
      expect(isStrongPassword('Pass123$')).toBe(true);
      expect(isStrongPassword('Pass123%')).toBe(true);
      expect(isStrongPassword('Pass123*')).toBe(true);
      expect(isStrongPassword('Pass123?')).toBe(true);
      expect(isStrongPassword('Pass123&')).toBe(true);
      expect(isStrongPassword('Pass123#')).toBe(true);
      expect(isStrongPassword('Pass123^')).toBe(true);
      expect(isStrongPassword('Pass123(')).toBe(true);
      expect(isStrongPassword('Pass123)')).toBe(true);
      expect(isStrongPassword('Pass123_')).toBe(true);
      expect(isStrongPassword('Pass123+')).toBe(true);
      expect(isStrongPassword('Pass123-')).toBe(true);
      expect(isStrongPassword('Pass123=')).toBe(true);
      expect(isStrongPassword('Pass123[')).toBe(true);
      expect(isStrongPassword('Pass123]')).toBe(true);
      expect(isStrongPassword('Pass123{')).toBe(true);
      expect(isStrongPassword('Pass123}')).toBe(true);
      expect(isStrongPassword('Pass123;')).toBe(true);
      expect(isStrongPassword('Pass123:')).toBe(true);
      expect(isStrongPassword('Pass123\'')).toBe(true);
      expect(isStrongPassword('Pass123"')).toBe(true);
      expect(isStrongPassword('Pass123\\')).toBe(true);
      expect(isStrongPassword('Pass123|')).toBe(true);
      expect(isStrongPassword('Pass123,')).toBe(true);
      expect(isStrongPassword('Pass123.')).toBe(true);
      expect(isStrongPassword('Pass123<')).toBe(true);
      expect(isStrongPassword('Pass123>')).toBe(true);
      expect(isStrongPassword('Pass123/')).toBe(true);
    });

    it('should accept longer passwords', () => {
      expect(isStrongPassword('VeryStrongPassword123!')).toBe(true);
      expect(isStrongPassword('SuperSecure123!@#$%')).toBe(true);
    });

    it('should accept password with multiple uppercase and lowercase', () => {
      expect(isStrongPassword('PaSsWoRd123!')).toBe(true);
    });

    it('should accept password with multiple numbers', () => {
      expect(isStrongPassword('Password123456!')).toBe(true);
    });

    it('should accept password with multiple special characters', () => {
      expect(isStrongPassword('Password123!@#')).toBe(true);
    });

    it('should handle edge case: exactly 8 characters with all requirements', () => {
      expect(isStrongPassword('Pass123!')).toBe(true);
    });

    it('should reject password with only 7 characters even with all other requirements', () => {
      expect(isStrongPassword('Pas123!')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isStrongPassword('')).toBe(false);
    });

    it('should reject password with only spaces', () => {
      expect(isStrongPassword('        ')).toBe(false);
    });

    it('should reject password with spaces', () => {
      expect(isStrongPassword('Pass Word123!')).toBe(false);
    });
  });
});

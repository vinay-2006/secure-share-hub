import { describe, it, expect } from '@jest/globals';

describe('Health Check', () => {
  it('should be a working test suite', () => {
    expect(true).toBe(true);
  });
  
  it('should have test environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBeDefined();
  });
});

import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('should allow user to register', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', email);
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="password"]', 'TestPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect or show success
    await page.waitForTimeout(1000);
  });
  
  test('should allow user to login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'Admin123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForTimeout(2000);
  });
});

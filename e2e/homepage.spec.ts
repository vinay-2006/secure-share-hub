import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Secure Share Hub/i);
    
    // Check for main heading
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('should have login and register links', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation links
    const loginLink = page.getByRole('link', { name: /login/i });
    const registerLink = page.getByRole('link', { name: /register/i });
    
    await expect(loginLink).toBeVisible();
    await expect(registerLink).toBeVisible();
  });
});

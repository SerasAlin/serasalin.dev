import { test, expect } from '@playwright/test';

test.describe('Accessibility smoke tests', () => {
  test('every primary page has a single h1 and a skip link', async ({ page }) => {
    for (const path of [
      '/',
      '/projects',
      '/lab',
      '/stack',
      '/uses',
      '/now',
      '/writing',
      '/contact',
    ]) {
      await page.goto(path);
      const h1s = await page.locator('h1').count();
      expect(h1s, `${path} should have exactly one h1`).toBe(1);
      await expect(page.getByRole('link', { name: /skip to content/i })).toBeAttached();
    }
  });
});

import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test('renders name, headline, and terminal', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('I build systems for the web.')).toBeVisible();
    await expect(page.getByLabel('Interactive terminal')).toBeVisible();
  });

  test('has functional navigation to /projects', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /projects/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { name: /things i have built/i })).toBeVisible();
  });
});

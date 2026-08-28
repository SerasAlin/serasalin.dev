import { test, expect } from '@playwright/test';

test.describe('Command palette', () => {
  test('opens with Cmd+K and lists commands', async ({ page, browserName }) => {
    await page.goto('/');
    const modifier = browserName === 'webkit' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+KeyK`);
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.getByPlaceholder(/search commands/i)).toBeFocused();
    await page.keyboard.type('projects');
    await expect(page.getByRole('option', { name: /go to projects/i })).toBeVisible();
  });

  test('Escape closes the palette', async ({ page, browserName }) => {
    await page.goto('/');
    const modifier = browserName === 'webkit' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+KeyK`);
    await expect(page.getByRole('combobox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('combobox')).toBeHidden();
  });
});

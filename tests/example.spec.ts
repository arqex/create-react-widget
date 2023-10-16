import { test, expect } from '@playwright/test';

test('has react and vite logos', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('vite')).toBeVisible();
  await expect(page.getByTestId('react')).toBeVisible();
});

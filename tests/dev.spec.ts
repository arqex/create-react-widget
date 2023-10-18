import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { test, expect, Page } from '@playwright/test';

test('has react and vite logos', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('vite')).toBeVisible();
  await expect(page.getByTestId('react')).toBeVisible();
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_PATH = path.resolve(__dirname, '../test-widget/src');
const updateWidgetTitle = (page: Page, title: string) => {
  const WIDGET_PATH = path.resolve(SRC_PATH, 'Widget.tsx');
  const widgetContent = fs.readFileSync(WIDGET_PATH, 'utf-8').replace(
    /<h1(.*?)>(.*?)<\/h1>/,
    `<h1$1>${title}</h1>`
  );
  fs.writeFileSync(WIDGET_PATH, widgetContent);
};

test('update the title should trigger a hot reload', async ({page}) => {
  const randomTitle = `Random Title ${Math.random()}`;
  await page.goto('/');
  const initalTitle = await page.getByTestId('title').innerText();

  updateWidgetTitle(page, randomTitle);
  await page.waitForTimeout(1000);

  const updatedTitle = await page.getByTestId('title').innerText();
  await expect(updatedTitle).not.toBe(initalTitle);
});

const updateTitleColor = (page: Page, color: string) => {
  const STYLES_PATH = path.resolve(SRC_PATH, 'Widget.module.css');
  const stylesContent = fs.readFileSync(STYLES_PATH, 'utf-8').replace(
    /\.title([^}]*?)(color:.*?;)/,
    `.title$1color: ${color};`
  );
  fs.writeFileSync(STYLES_PATH, stylesContent);
};
test('update css should trigger a hot reload', async ({page}) => {
  await page.goto('/');

  const title = await page.getByTestId('title');
  const initialColor = await title.evaluate((el) => getComputedStyle(el).color);

  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  updateTitleColor(page, randomColor);
  await page.waitForTimeout(1000);

  const updatedColor = await title.evaluate((el) => getComputedStyle(el).color);
  await expect(updatedColor).not.toBe(initialColor);
});

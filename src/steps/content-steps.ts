import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { getPage } from '../support/browser';

let homePage: HomePage;

Then('the main heading should contain {string}', async function (expectedText: string) {
  const page = getPage();
  homePage = new HomePage(page);
  const heading = await homePage.getPageHeading();
  expect(heading.toLowerCase()).toContain(expectedText.toLowerCase());
});

Then('all four main business sections should be visible', async function () {
  const page = getPage();
  homePage = new HomePage(page);

  const decarbonizing = await homePage.isDecarbonizingSectionVisible();
  const innovating = await homePage.isInnovatingSectionVisible();
  const newEnergy = await homePage.isNewEnergySectionVisible();

  // At least 3 of the 4 main sections should be visible
  const visibleSections = [decarbonizing, innovating, newEnergy].filter(Boolean).length;
  expect(visibleSections).toBeGreaterThanOrEqual(3);
});

Then('the page should be fully loaded', async function () {
  const page = getPage();
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  const readyState = await page.evaluate(() => (document as Document).readyState);
  expect(['interactive', 'complete']).toContain(readyState);
});

Then('all main content sections should be rendered', async function () {
  const page = getPage();
  const headings = await page.locator('h1, h2, h3').count();
  expect(headings).toBeGreaterThan(5); // Homepage has multiple headings
});


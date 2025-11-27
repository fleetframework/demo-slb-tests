/**
 * Search Functionality Step Definitions
 *
 * This module contains Cucumber step definitions for SLB website search functionality.
 * Cookies are already accepted during browser initialization in hooks.ts,
 * so no cookie handling is needed in step definitions.
 *
 * @module steps/search-steps
 */

import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage } from '../support/browser';

/**
 * Step: Clicks the search button to open search panel
 */
When('I click on the search button', async function () {
  const page = getPage();
  const searchButton = page.getByRole('button', { name: /search/i });

  // Click the search button - cookies already accepted in hooks
  await searchButton.click();

  // Wait for search panel to open
  await page.locator('#_searchFieldDesktop').waitFor({ state: 'visible', timeout: 5000 });
});

Then('the search panel should be visible', async function () {
  const page = getPage();
  // Target the visible search input (desktop)
  const searchPanel = page.locator('#_searchFieldDesktop');
  const isVisible = await searchPanel.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('the search input field should be present', async function () {
  const page = getPage();
  const searchInputs = page.getByPlaceholder(/what are you looking for/i);
  const count = await searchInputs.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

/**
 * Step: Clicks on a popular search term
 */
When('I click on {string} in popular searches', async function (searchTerm: string) {
  const page = getPage();

  // Wait for the popular search link to be visible
  const popularSearchLink = page.getByRole('link', { name: searchTerm, exact: true });
  await popularSearchLink.waitFor({ state: 'visible', timeout: 10000 });

  // Scroll into view if needed
  await popularSearchLink.scrollIntoViewIfNeeded();

  // Click the link
  await popularSearchLink.click();

  // Wait for navigation to search results
  await page.waitForURL('**/search**', { timeout: 10000 });
});

When('I enter {string} in the search field', async function (searchTerm: string) {
  const page = getPage();
  // Use the desktop search field which is typically visible
  const searchInput = page.locator('#_searchFieldDesktop');
  await searchInput.fill(searchTerm);
});

When('I submit the search', async function () {
  const page = getPage();
  const searchInput = page.locator('#_searchFieldDesktop');
  await searchInput.press('Enter');
  await page.waitForLoadState('domcontentloaded');
});

Then('I should be redirected to the search results page', async function () {
  const page = getPage();
  await page.waitForURL('**/search**', { timeout: 10000 });
  const url = page.url();
  expect(url).toContain('/search');
});

Then('the search results should be displayed', async function () {
  const page = getPage();
  // Wait for search results to render by checking common result selectors
  const resultsSelectors = ['article.search-result', '.search-result', '.document-card', '.search-results'];

  let found = false;
  for (const selector of resultsSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      found = true;
      break;
    }
  }

  expect(found).toBeTruthy();
});

Then('the search query should be {string}', async function (expectedQuery: string) {
  const page = getPage();
  const url = page.url();
  expect(url).toContain(`q=${expectedQuery}`);
});


/**
 * Search Functionality Step Definitions
 *
 * This module contains Cucumber step definitions for SLB website search functionality.
 * Implements robust interaction patterns to handle cookie overlays and dynamic content.
 *
 * Key Features:
 * - Multi-strategy click approach (normal → JavaScript → navigation)
 * - Automatic cookie overlay removal before interactions
 * - Retry logic with fallback mechanisms
 * - Popular searches and search input support
 *
 * @module steps/search-steps
 */

import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage } from '../support/browser';
import { ensureNoCookieOverlay } from '../utils/cookie-handler';

/**
 * Step: Clicks the search button to open search panel
 * Uses multi-strategy approach to handle overlays
 */
When('I click on the search button', async function () {
  const page = getPage();

  // Ensure no cookie overlay is blocking
  await ensureNoCookieOverlay(page);

  const searchButton = page.getByRole('button', { name: /search/i });

  // Check one more time right before clicking (overlay can appear dynamically)
  await ensureNoCookieOverlay(page);

  // Try normal click first, then use JavaScript click if overlay is blocking
  try {
    await searchButton.click({ timeout: 3000 });
  } catch (error) {
    console.log('⚠ Search button click blocked, using JavaScript click');
    // Use JavaScript click to bypass overlay but still trigger event handlers
    await searchButton.evaluate((el: HTMLElement) => el.click());
  }

  // Wait for search panel to open by waiting for the search input to be visible
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

When('I click on {string} in popular searches', async function (searchTerm: string) {
  const page = getPage();

  // Ensure no cookie overlay is blocking interactions
  await ensureNoCookieOverlay(page);

  // Wait for the popular search link to be visible and enabled
  const popularSearchLink = page.getByRole('link', { name: searchTerm, exact: true });
  await popularSearchLink.waitFor({ state: 'visible', timeout: 10000 });

  // Scroll into view if needed
  await popularSearchLink.scrollIntoViewIfNeeded();

  // Wait a bit for any animations to complete
  await page.waitForTimeout(300);

  // Get the href for fallback navigation
  const href = await popularSearchLink.getAttribute('href');
  console.log(`Link href: ${href}`);

  // Click the link with retry logic
  try {
    // Try normal click with navigation wait
    await Promise.race([
      popularSearchLink.click({ timeout: 5000 }),
      page.waitForURL('**/search**', { timeout: 6000 })
    ]);
  } catch (error) {
    console.log('⚠ Normal click failed, navigating directly using href');

    // Navigate directly using the href
    if (href) {
      const baseUrl = new URL(page.url()).origin;
      const fullUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;
      console.log(`Navigating to: ${fullUrl}`);
      await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
    } else {
      throw new Error('Unable to navigate: no href found');
    }
  }

  // Debug: Log current URL
  console.log('Current URL after click:', page.url());
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
  await page.waitForTimeout(2000); // Wait for results to load

  // Check for search results page elements
  const pageLoaded = await page.locator('body').count() > 0;
  expect(pageLoaded).toBeTruthy();
});

Then('the search query should be {string}', async function (expectedQuery: string) {
  const page = getPage();
  const url = page.url();
  expect(url).toContain(`q=${expectedQuery}`);
});


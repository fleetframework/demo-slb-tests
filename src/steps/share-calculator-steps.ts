import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage } from '../support/browser';
import { ShareCalculatorPage } from '../pages/ShareCalculatorPage';

let pageObj: ShareCalculatorPage;

Given('I open the Share Calculator page', async function () {
  const page = getPage();
  pageObj = new ShareCalculatorPage(page);
  await pageObj.navigate();
  // Ensure page loaded
  const url = await pageObj.getUrl();
  expect(url).toContain('share-calculator');
});

When('I enter valid inputs for shares and date and submit the form', async function () {
  await pageObj.fillShares('100');
  await pageObj.fillDate('2023-06-15');
  // Capture URL before submit
  (this as any).preSubmitUrl = await pageObj.getUrl();
  await pageObj.submit();
});

Then('I should see an accessible results table rendered dynamically without a page reload', async function () {
  const preUrl = (this as any).preSubmitUrl;
  await pageObj.waitForLoadingToFinish();
  // URL should remain same (no page reload)
  const postUrl = await pageObj.getUrl();
  expect(postUrl).toBe(preUrl);

  const hasTable = (await pageObj.getResultsRowCount()) > 0 && (await pageObj.getResultsTableHeaders()).length > 0;
  expect(hasTable).toBeTruthy();
  const accessible = await pageObj.isResultsTableAccessible();
  expect(accessible).toBeTruthy();
});

Then('a loading indicator should appear and disappear during calculation when present', async function () {
  // If there is a loader, its visibility should toggle
  const loader = await getPage().locator(pageObj.loadingIndicator).first();
  // We cannot deterministically assert it appears, but if it exists, ensure it hides eventually
  if (await loader.count() > 0) {
    try {
      if (await loader.isVisible()) {
        await loader.waitFor({ state: 'hidden', timeout: 15000 });
      }
    } catch {
      // if it never disappears, fail
      expect(await loader.isVisible()).toBeFalsy();
    }
  }
});

Then('the results table should contain column headers and at least one result row', async function () {
  const headers = await pageObj.getResultsTableHeaders();
  const rows = await pageObj.getResultsRowCount();
  expect(headers.length).toBeGreaterThan(0);
  expect(rows).toBeGreaterThan(0);
});

Then('the page URL should not change after submission', async function () {
  const preUrl = (this as any).preSubmitUrl;
  const postUrl = await pageObj.getUrl();
  expect(postUrl).toBe(preUrl);
});

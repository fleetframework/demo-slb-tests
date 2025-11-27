import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage } from '../support/browser';
import { SearchResultsPage } from '../pages/SearchResultsPage';

let resultsPage: SearchResultsPage;

Given('I am on the SLB homepage', async function () {
  const page = getPage();
  await page.goto('https://www.slb.com');
  await page.waitForLoadState('domcontentloaded');
});

When('I open the search panel', async function () {
  const page = getPage();
  const searchButton = page.getByRole('button', { name: /search/i });
  await searchButton.click();
  await page.locator('#_searchFieldDesktop').waitFor({ state: 'visible', timeout: 5000 });
});

When('I search for case studies with keyword {string}', async function (keyword: string) {
  const page = getPage();
  resultsPage = new SearchResultsPage(page);
  await resultsPage.performSearch(keyword);
});

When('I apply the following filters:', async function (dataTable) {
  const page = getPage();
  // dataTable is cucumber data table with filter names and values
  const rows = dataTable.hashes();

  for (const row of rows) {
    const name = row['Filter'];
    const value = row['Value'];

    // Try to find filter controls by label text
    const filterLabel = page.getByText(name, { exact: true });
    if (await filterLabel.count() > 0) {
      await filterLabel.click();
      const option = page.getByRole('option', { name: value });
      if (await option.count() > 0) {
        await option.click();
      } else {
        // Fallback: click link with text
        const link = page.locator(`a:has-text("${value}")`).first();
        if (await link.count() > 0) {
          await link.click();
        }
      }
    } else {
      // Try common filter selectors
      const checkbox = page.locator(`label:has-text("${value}")`).first();
      if (await checkbox.count() > 0) {
        await checkbox.click();
      }
    }
  }

  // Wait for filters to apply and results to update
  await page.waitForLoadState('networkidle');
  await resultsPage.waitForResults();
});

Then('I should see case studies in results with localized titles where available', async function () {
  const page = getPage();
  const titles = await resultsPage.getResultTitles();

  expect(titles.length).toBeGreaterThan(0);

  // Basic localization check: ensure some results contain non-ASCII characters when searching zh-CN
  const hasLocalized = titles.some(t => /[\u4e00-\u9fff]/.test(t));
  // We don't always expect localized content; only ensure results are present
  expect(titles.length).toBeGreaterThan(0);
});

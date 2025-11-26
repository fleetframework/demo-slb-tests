import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { StockShareCalculatorPage } from '../pages/StockShareCalculatorPage';
import { Page } from '@playwright/test';

let page: Page;
let stockShareCalculatorPage: StockShareCalculatorPage;

Given('I navigate to the Stock/Share Calculator page', async () => {
  stockShareCalculatorPage = new StockShareCalculatorPage(page);
  await stockShareCalculatorPage.navigateToCalculator();
});

When('I enter {string} into the Shares input field', async (shares: string) => {
  await stockShareCalculatorPage.fillSharesInput(shares);
});

When('I enter {string} into the Date input field', async (date: string) => {
  await stockShareCalculatorPage.fillDateInput(date);
});

When('I submit the form', async () => {
  await stockShareCalculatorPage.submitForm();
});

Then('the results table should render with the following columns:', async (dataTable) => {
  const expectedColumns = dataTable.raw().flat();
  const actualColumns = await stockShareCalculatorPage.getTableHeaders();
  expect(actualColumns).toEqual(expectedColumns);
});

Then('the table should have proper accessibility markup', async () => {
  const tableMarkup = await stockShareCalculatorPage.resultsTable.evaluate((table) => {
    return {
      caption: table.querySelector('caption') !== null,
      thead: table.querySelector('thead') !== null,
      tbody: table.querySelector('tbody') !== null,
      thScope: Array.from(table.querySelectorAll('th')).every((th) => th.getAttribute('scope') === 'col'),
    };
  });

  expect(tableMarkup.caption).toBe(true);
  expect(tableMarkup.thead).toBe(true);
  expect(tableMarkup.tbody).toBe(true);
  expect(tableMarkup.thScope).toBe(true);
});

Then('currency values should display with thousands separators and 2 decimals', async () => {
  const rows = await stockShareCalculatorPage.getTableRows();
  rows.forEach((row) => {
    const currencyValue = row[2]; // Assuming Original Value is the 3rd column
    expect(currencyValue).toMatch(/^\$\d{1,3}(,\d{3})*\.\d{2}$/);
  });
});

Then('percentages should display with sign and 2 decimals', async () => {
  const rows = await stockShareCalculatorPage.getTableRows();
  rows.forEach((row) => {
    const percentageValue = row[5]; // Assuming % Return is the 6th column
    expect(percentageValue).toMatch(/^[+-]\d+\.\d{2}%$/);
  });
});

Then('shares should display up to 4 decimals', async () => {
  const rows = await stockShareCalculatorPage.getTableRows();
  rows.forEach((row) => {
    const sharesValue = row[3]; // Assuming Current Shares is the 4th column
    expect(sharesValue).toMatch(/^\d+\.\d{4}$/);
  });
});

Then('split adjustment should display as ratios', async () => {
  const rows = await stockShareCalculatorPage.getTableRows();
  rows.forEach((row) => {
    const splitAdjustment = row[6]; // Assuming Split Adjustment is the 7th column
    expect(splitAdjustment).toMatch(/^\d+:\d+$/);
  });
});

When('I resize the viewport to {int}px', async (width: number) => {
  await page.setViewportSize({ width, height: 800 });
});

Then('the table should support horizontal scrolling with sticky headers', async () => {
  const isScrollable = await stockShareCalculatorPage.resultsTable.evaluate((table) => {
    return table.scrollWidth > table.clientWidth;
  });
  expect(isScrollable).toBe(true);

  const stickyHeaders = await stockShareCalculatorPage.resultsTable.locator('thead').evaluate((thead) => {
    const style = window.getComputedStyle(thead);
    return style.position === 'sticky';
  });
  expect(stickyHeaders).toBe(true);
});

Then('no content or header truncation should occur', async () => {
  const headers = await stockShareCalculatorPage.resultsTable.locator('thead th').allTextContents();
  headers.forEach((header) => {
    expect(header.length).toBeGreaterThan(0);
  });
});

Then('the results table should update dynamically without page reload', async () => {
  const initialRows = await stockShareCalculatorPage.getTableRows();
  await stockShareCalculatorPage.fillSharesInput('200');
  await stockShareCalculatorPage.fillDateInput('2023-07-01');
  await stockShareCalculatorPage.submitForm();
  const updatedRows = await stockShareCalculatorPage.getTableRows();
  expect(updatedRows).not.toEqual(initialRows);
});

Then('the table should display an Empty state message', async () => {
  const emptyMessage = await stockShareCalculatorPage.getEmptyStateMessage();
  expect(emptyMessage).toBe('No data available');
});

Then('the table should display a Loading state message', async () => {
  const loadingMessage = await stockShareCalculatorPage.getLoadingStateMessage();
  expect(loadingMessage).toBe('Loading data...');
});

Then('the table should display an Error state message', async () => {
  const errorMessage = await stockShareCalculatorPage.getErrorStateMessage();
  expect(errorMessage).toBe('An error occurred while fetching data');
});
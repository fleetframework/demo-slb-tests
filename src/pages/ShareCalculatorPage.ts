import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShareCalculatorPage extends BasePage {
  // Page URL
  static readonly url = 'https://investorcenter.slb.com/stock/share-calculator';

  // Locators - use robust selectors where possible
  readonly sharesInput = 'input[name="shares"], input[id*="shares"], input[aria-label*="Shares"]';
  readonly dateInput = 'input[type="date"], input[name*="date"], input[id*="date"]';
  readonly submitButton = 'button[type="submit"], button:has-text("Calculate"), button:has-text("Submit")';
  readonly resultsTable = 'table:visible, [role="table"]:visible';
  readonly resultsTableHeader = `${this.resultsTable} th`;
  readonly resultsTableRows = `${this.resultsTable} tbody tr`;
  readonly loadingIndicator = '[aria-busy="true"], .loading, .spinner, .skeleton';
  readonly errorMessage = '[role="alert"], .error, .form-error';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo(ShareCalculatorPage.url);
    await this.waitForLoadState();
  }

  async fillShares(value: string): Promise<void> {
    const shares = this.page.locator(this.sharesInput).first();
    await shares.waitFor({ state: 'visible', timeout: 10000 });
    await shares.fill(value);
  }

  async fillDate(value: string): Promise<void> {
    const date = this.page.locator(this.dateInput).first();
    await date.waitFor({ state: 'visible', timeout: 10000 });
    await date.fill(value);
  }

  async submit(): Promise<void> {
    const submit = this.page.locator(this.submitButton).first();
    await submit.waitFor({ state: 'visible', timeout: 10000 });
    await Promise.all([
      this.page.waitForResponse(resp => resp.request().method() === 'POST' || resp.request().method() === 'GET', { timeout: 15000 }).catch(() => {}),
      submit.click(),
    ]);
  }

  async waitForLoadingToFinish(timeout = 15000): Promise<void> {
    const loader = this.page.locator(this.loadingIndicator).first();
    try {
      if (await loader.isVisible()) {
        await loader.waitFor({ state: 'hidden', timeout });
      }
    } catch {
      // ignore
    }
  }

  async getResultsTableHeaders(): Promise<string[]> {
    const headers = await this.page.locator(this.resultsTableHeader).allTextContents();
    return headers.map(h => h.trim()).filter(h => h.length > 0);
  }

  async getResultsRowCount(): Promise<number> {
    return await this.page.locator(this.resultsTableRows).count();
  }

  async isResultsTableAccessible(): Promise<boolean> {
    const table = this.page.locator(this.resultsTable).first();
    if (!(await table.count())) return false;
    // Check for semantic markup
    const role = await table.getAttribute('role');
    const ariaLabel = await table.getAttribute('aria-label');
    const hasThead = (await table.locator('thead').count()) > 0;
    const hasTh = (await table.locator('th').count()) > 0;
    return hasTh || hasThead || !!ariaLabel || role === 'table';
  }

  async hasError(): Promise<boolean> {
    return (await this.page.locator(this.errorMessage).count()) > 0;
  }
}

import { BasePage } from './BasePage';
import { Page, Locator } from '@playwright/test';

export class StockShareCalculatorPage extends BasePage {
  private sharesInput: Locator;
  private dateInput: Locator;
  private submitButton: Locator;
  private resultsTable: Locator;
  private emptyStateMessage: Locator;
  private loadingStateMessage: Locator;
  private errorStateMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.sharesInput = page.locator('#shares-input');
    this.dateInput = page.locator('#date-input');
    this.submitButton = page.locator('#submit-button');
    this.resultsTable = page.locator('#results-table');
    this.emptyStateMessage = page.locator('#empty-state');
    this.loadingStateMessage = page.locator('#loading-state');
    this.errorStateMessage = page.locator('#error-state');
  }

  async navigateToCalculator(): Promise<void> {
    await this.navigateTo('/stock-share-calculator');
  }

  async fillSharesInput(shares: string): Promise<void> {
    await this.fill('#shares-input', shares);
  }

  async fillDateInput(date: string): Promise<void> {
    await this.fill('#date-input', date);
  }

  async submitForm(): Promise<void> {
    await this.click('#submit-button');
  }

  async getTableHeaders(): Promise<string[]> {
    return await this.resultsTable.locator('thead th').allTextContents();
  }

  async getTableRows(): Promise<string[][]> {
    const rows = await this.resultsTable.locator('tbody tr');
    const rowData: string[][] = [];
    for (const row of await rows.elementHandles()) {
      const cells = await row.locator('td').allTextContents();
      rowData.push(cells);
    }
    return rowData;
  }

  async getEmptyStateMessage(): Promise<string> {
    return await this.getText('#empty-state');
  }

  async getLoadingStateMessage(): Promise<string> {
    return await this.getText('#loading-state');
  }

  async getErrorStateMessage(): Promise<string> {
    return await this.getText('#error-state');
  }
}
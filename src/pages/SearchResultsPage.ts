import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  private readonly searchInput = '#_searchFieldDesktop';
  private readonly resultItems = 'article.search-result, .search-result, .document-card';
  private readonly filterPanel = '.search-filters, .filters';
  private readonly facetLabels = '.facet-label, .filter-label';

  constructor(page: Page) {
    super(page);
  }

  async waitForResults(): Promise<void> {
    await this.page.waitForSelector(this.resultItems, { timeout: 10000 });
  }

  async getResultTitles(): Promise<string[]> {
    await this.waitForResults();
    return await this.page.locator(this.resultItems).allTextContents();
  }

  async isFilterPanelVisible(): Promise<boolean> {
    return (await this.page.locator(this.filterPanel).count()) > 0;
  }

  async getFacetLabels(): Promise<string[]> {
    if (await this.isFilterPanelVisible()) {
      return await this.page.locator(this.facetLabels).allTextContents();
    }
    return [];
  }

  async performSearch(query: string): Promise<void> {
    const input = this.page.locator(this.searchInput);
    await input.fill(query);
    await input.press('Enter');
    await this.waitForResults();
  }
}

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  // Selectors
  private readonly pageTitle = 'h1, h2';
  private readonly contactForm = 'form';
  private readonly pageContent = 'main, article, .content';

  constructor(page: Page) {
    super(page);
  }

  async verifyContactPageLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      const url = await this.getUrl();
      return url.includes('contact');
    } catch (error) {
      return false;
    }
  }

  async getPageTitle(): Promise<string> {
    try {
      await this.page.waitForSelector(this.pageTitle, { timeout: 10000 });
      return await this.getText(this.pageTitle);
    } catch (error) {
      return '';
    }
  }

  async isContactFormVisible(): Promise<boolean> {
    const form = this.page.locator(this.contactForm).first();
    return await form.isVisible().catch(() => false);
  }

  async isPageContentVisible(): Promise<boolean> {
    const content = this.page.locator(this.pageContent).first();
    return await content.isVisible().catch(() => false);
  }
}


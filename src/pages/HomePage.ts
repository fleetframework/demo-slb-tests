import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/config';

export class HomePage extends BasePage {
  // Selectors - Based on Playwright MCP analysis of slb.com
  private readonly pageHeading = 'h1';
  private readonly navigationMenu = 'nav, navigation, header nav';
  private readonly contactLink = 'a:has-text("Contact")';
  private readonly languageSelector = 'button:has-text("En")';
  private readonly loginButton = 'button:has-text("Log In")';
  private readonly decarbonizingSection = 'h3:has-text("Decarbonizing Industry")';
  private readonly innovatingSection = 'h3:has-text("Innovating in Oil and Gas")';
  private readonly newEnergySection = 'h3:has-text("Scaling New Energy Systems")';
  private readonly careerLink = 'a[href*="careers"]';
  private readonly softwareSupportLink = 'a[href*="software.slb.com/support"]';
  private readonly mainHeadingText = 'We are a global technology company, driving energy innovation for a balanced planet.';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo(config.baseURL);
    await this.waitForLoadState();
  }

  async getPageHeading(): Promise<string> {
    await this.page.waitForSelector(this.pageHeading, { timeout: 30000 });
    const text = await this.getText(this.pageHeading);
    // Clean up the text (remove extra whitespace)
    return text.replace(/\s+/g, ' ').trim();
  }

  async verifyMainHeading(): Promise<boolean> {
    const heading = await this.getPageHeading();
    const expectedText = this.mainHeadingText;
    return heading.includes('global technology company') && heading.includes('energy innovation');
  }

  async isNavigationVisible(): Promise<boolean> {
    try {
      const navCount = await this.page.locator('nav').count();
      return navCount > 0;
    } catch {
      return false;
    }
  }

  async clickContactLink(): Promise<void> {
    await this.page.locator(this.contactLink).first().click();
    await this.waitForLoadState();
  }

  async clickLoginButton(): Promise<void> {
    const loginBtn = this.page.locator(this.loginButton).first();
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
    }
  }

  async isDecarbonizingSectionVisible(): Promise<boolean> {
    const section = this.page.locator(this.decarbonizingSection).first();
    await section.scrollIntoViewIfNeeded();
    return await section.isVisible();
  }

  async isInnovatingSectionVisible(): Promise<boolean> {
    const section = this.page.locator(this.innovatingSection).first();
    await section.scrollIntoViewIfNeeded();
    return await section.isVisible();
  }

  async isNewEnergySectionVisible(): Promise<boolean> {
    const section = this.page.locator(this.newEnergySection).first();
    await section.scrollIntoViewIfNeeded();
    return await section.isVisible();
  }

  async clickCareerLink(): Promise<void> {
    await this.page.locator(this.careerLink).first().click();
  }

  async clickSoftwareSupportLink(): Promise<void> {
    await this.page.locator(this.softwareSupportLink).first().click();
  }

  async verifyPageLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 45000 });
      // Check if either heading or navigation is present
      const heading = this.page.locator(this.pageHeading).first();
      const nav = this.page.locator(this.navigationMenu).first();

      const headingCount = await heading.count();
      const navCount = await nav.count();

      return headingCount > 0 || navCount > 0;
    } catch (error) {
      return false;
    }
  }

  async getAllNavigationLinks(): Promise<string[]> {
    const links = await this.page.locator('nav a').allTextContents();
    return links.filter(link => link.trim().length > 0);
  }
}


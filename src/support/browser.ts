import { LaunchOptions, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { config } from '../config/config';

interface ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
}

let browser: Browser;
let context: BrowserContext;
let page: Page;
let isFirstScenario = true;

const launchOptions: LaunchOptions = {
  headless: process.env.HEADLESS !== 'false',
  slowMo: 0,
};

export async function createBrowser(): Promise<Browser> {
  // In single session mode, reuse existing browser
  if (config.singleSession && browser) {
    return browser;
  }
  browser = await chromium.launch(launchOptions);
  return browser;
}

export async function createContext(browser: Browser): Promise<BrowserContext> {
  // In single session mode, reuse existing context
  if (config.singleSession && context) {
    return context;
  }
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    acceptDownloads: true,
    recordVideo: process.env.CI ? { dir: 'reports/videos' } : undefined,
  });
  return context;
}

export async function createPage(context: BrowserContext): Promise<Page> {
  // In single session mode, reuse existing page (navigate to base URL for new scenarios)
  if (config.singleSession && page && !isFirstScenario) {
    return page;
  }

  if (config.singleSession && page) {
    isFirstScenario = false;
  }

  page = await context.newPage();
  return page;
}

export function getBrowser(): Browser {
  return browser;
}

export function getContext(): BrowserContext {
  return context;
}

export function getPage(): Page {
  return page;
}

export function isFirstScenarioRun(): boolean {
  return isFirstScenario;
}

export function setFirstScenario(value: boolean): void {
  isFirstScenario = value;
}

export async function closeBrowser(): Promise<void> {
  // In single session mode, don't close browser between scenarios
  if (config.singleSession) {
    return;
  }

  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
}

export async function closeAllBrowsers(): Promise<void> {
  // Force close everything (used in AfterAll)
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
}


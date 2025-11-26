import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { createBrowser, createContext, createPage, closeBrowser, closeAllBrowsers, getPage, isFirstScenarioRun } from './browser';
import { config } from '../config/config';
import { dismissCookieBanner } from '../utils/cookie-handler';

// Set default timeout to 60 seconds for all steps
setDefaultTimeout(60000);

/**
 * BeforeAll Hook
 * Runs once before all scenarios
 * Logs test suite configuration
 */
BeforeAll(async function () {
  console.log('Test suite starting...');
  console.log(`Single session mode: ${config.singleSession ? 'ENABLED' : 'DISABLED'}`);
});

/**
 * Before Hook
 * Runs before each scenario
 * Creates browser, context, and page
 * On first run: navigates to homepage and dismisses cookie banner
 */
Before(async function () {
  const browser = await createBrowser();
  const context = await createContext(browser);
  await createPage(context);

  // On first scenario, navigate to homepage and accept cookies
  // This ensures cookies are handled before any test steps execute
  if (!config.singleSession || isFirstScenarioRun()) {
    const page = getPage();

    // Navigate to base URL to trigger cookie banner
    await page.goto(config.baseURL, { waitUntil: 'domcontentloaded' });

    // Dismiss cookie banner immediately after page loads
    await dismissCookieBanner(page);

    console.log('✓ Initial page loaded and cookies accepted');
  }
});

/**
 * After Hook
 * Runs after each scenario
 * Captures screenshot and HTML on failure for debugging
 * Closes browser if not in single session mode
 */
After(async function ({ result }) {
  if (result?.status === Status.FAILED) {
    const page = getPage();

    // Capture full-page screenshot for visual debugging
    const screenshot = await page.screenshot({ type: 'png', fullPage: true });
    this.attach(screenshot, 'image/png');

    // Attach page HTML for debugging DOM state
    const html = await page.content();
    this.attach(html, 'text/html');
  }

  // Only close browser if not in single session mode
  // In single session mode, browser persists across scenarios
  await closeBrowser();
});

/**
 * AfterAll Hook
 * Runs once after all scenarios
 * Force closes browser in single session mode
 */
AfterAll(async function () {
  console.log('Test suite completed.');
  // Force close browser in single session mode
  if (config.singleSession) {
    await closeAllBrowsers();
    console.log('Browser session closed.');
  }
});


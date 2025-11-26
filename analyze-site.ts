import { chromium } from '@playwright/test';

async function analyzeSLBWebsite() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to SLB website...');
    await page.goto('https://www.slb.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Get page title
    const title = await page.title();
    console.log('Page Title:', title);

    // Get main navigation elements
    console.log('\n=== Analyzing Navigation ===');
    const navLinks = await page.locator('nav a, header a').all();
    console.log(`Found ${navLinks.length} navigation links`);

    for (let i = 0; i < Math.min(10, navLinks.length); i++) {
      const text = await navLinks[i].textContent();
      const href = await navLinks[i].getAttribute('href');
      if (text?.trim()) {
        console.log(`- ${text.trim()} (${href})`);
      }
    }

    // Check for search functionality
    console.log('\n=== Checking for Search ===');
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="search" i]',
      'input[aria-label*="search" i]',
      '[data-testid*="search" i]',
      '.search-input',
      '#search'
    ];

    for (const selector of searchSelectors) {
      const searchBox = page.locator(selector).first();
      if (await searchBox.count() > 0) {
        console.log(`Found search box: ${selector}`);
        break;
      }
    }

    // Check for main sections
    console.log('\n=== Main Page Sections ===');
    const headings = await page.locator('h1, h2, h3').all();
    console.log(`Found ${headings.length} headings`);

    for (let i = 0; i < Math.min(5, headings.length); i++) {
      const text = await headings[i].textContent();
      const tagName = await headings[i].evaluate(el => el.tagName);
      if (text?.trim()) {
        console.log(`${tagName}: ${text.trim()}`);
      }
    }

    // Check for buttons
    console.log('\n=== Interactive Elements ===');
    const buttons = await page.locator('button, a.btn, a.button, [role="button"]').all();
    console.log(`Found ${buttons.length} buttons/CTAs`);

    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      const text = await buttons[i].textContent();
      if (text?.trim()) {
        console.log(`- ${text.trim()}`);
      }
    }

    // Check footer
    console.log('\n=== Footer Information ===');
    const footer = page.locator('footer');
    if (await footer.count() > 0) {
      const footerLinks = await footer.locator('a').all();
      console.log(`Found ${footerLinks.length} footer links`);
    }

    // Take screenshot
    await page.screenshot({ path: 'reports/slb-homepage.png', fullPage: true });
    console.log('\nScreenshot saved to reports/slb-homepage.png');

  } catch (error) {
    console.error('Error analyzing website:', error);
  } finally {
    await browser.close();
  }
}

analyzeSLBWebsite();


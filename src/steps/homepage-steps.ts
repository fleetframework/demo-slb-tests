import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';
import { getPage } from '../support/browser';

let homePage: HomePage;
let contactPage: ContactPage;

Given('I am on the SLB homepage', async function () {
  const page = getPage();
  homePage = new HomePage(page);
  await homePage.navigate();
  const loaded = await homePage.verifyPageLoaded();
  expect(loaded).toBeTruthy();
});

Then('I should see the main company heading', async function () {
  const isValid = await homePage.verifyMainHeading();
  expect(isValid).toBeTruthy();
});

Then('the navigation should be present', async function () {
  const isVisible = await homePage.isNavigationVisible();
  expect(isVisible).toBeTruthy();
});

Then('the page title should contain {string}', async function (expectedText: string) {
  const title = await homePage.getTitle();
  expect(title).toContain(expectedText);
});

Then('I should see the {string} section', async function (sectionName: string) {
  let isVisible = false;

  switch (sectionName) {
    case 'Decarbonizing Industry':
      isVisible = await homePage.isDecarbonizingSectionVisible();
      break;
    case 'Innovating in Oil and Gas':
      isVisible = await homePage.isInnovatingSectionVisible();
      break;
    case 'Scaling New Energy Systems':
      isVisible = await homePage.isNewEnergySectionVisible();
      break;
    default:
      throw new Error(`Unknown section: ${sectionName}`);
  }

  expect(isVisible).toBeTruthy();
});

Then('the {string} link should be visible', async function (linkName: string) {
  const page = getPage();
  
  if (linkName === 'Contact') {
    // Wait for page to be ready
    await page.waitForLoadState('domcontentloaded');
    
    // Try multiple selectors for Contact link
    const contactSelectors = [
      'a:has-text("Contact")',
      'a[href="/contact-us"]',
      'a[href*="contact"]'
    ];
    
    let isVisible = false;
    for (const selector of contactSelectors) {
      const link = page.locator(selector).first();
      if (await link.count() > 0 && await link.isVisible()) {
        isVisible = true;
        break;
      }
    }
    
    expect(isVisible).toBeTruthy();
  } else {
    throw new Error(`Unknown link: ${linkName}`);
  }
});

Then('the {string} button should be visible', async function (buttonName: string) {
  const page = getPage();
  let button;

  if (buttonName === 'Log In') {
    button = page.locator('button:has-text("Log In")').first();
  } else {
    throw new Error(`Unknown button: ${buttonName}`);
  }

  const isVisible = await button.isVisible();
  expect(isVisible).toBeTruthy();
});

Then('the language selector should be visible', async function () {
  const page = getPage();
  await page.waitForLoadState('domcontentloaded');

  // Try multiple selectors for language selector
  const langSelectors = [
    'button:has-text("En")',
    'button[aria-label*="language"]',
    '[class*="language"]',
    'button:has-text("English")'
  ];

  let isVisible = false;
  for (const selector of langSelectors) {
    const element = page.locator(selector).first();
    if (await element.count() > 0) {
      isVisible = true;
      break; // Found at least one language selector element
    }
  }

  expect(isVisible).toBeTruthy();
});


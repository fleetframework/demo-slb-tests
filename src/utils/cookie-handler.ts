import { Page } from '@playwright/test';

/**
 * Dismisses OneTrust cookie banner and waits for overlay to be removed.
 *
 * This function implements a robust approach to handle cookie consent:
 * 1. Waits for the cookie banner to appear (up to 5 seconds)
 * 2. Clicks the OneTrust Accept button
 * 3. Waits for overlay removal to ensure no blocking elements remain
 * 4. Falls back to standard Accept button patterns if OneTrust not found
 *
 * Should be called once when the browser first loads the site.
 * After acceptance, cookies persist across the session.
 *
 * @param page - Playwright page object
 * @returns Promise<boolean> - true if cookie banner was dismissed, false if not found
 *
 * @example
 * ```typescript
 * const page = await browser.newPage();
 * await page.goto('https://www.slb.com');
 * const dismissed = await dismissCookieBanner(page);
 * ```
 */
export async function dismissCookieBanner(page: Page): Promise<boolean> {
  try {
    console.log('Checking for cookie banner...');

    // Wait for cookie banner to potentially appear
    await page.waitForTimeout(2000);

    // Check if OneTrust Accept button exists and is visible
    const oneTrustButton = page.locator('#onetrust-accept-btn-handler');
    const isVisible = await oneTrustButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      // Click the accept button
      await oneTrustButton.click();
      console.log('✓ Clicked OneTrust Accept button');

      // Critical: Wait for the overlay to be completely removed from DOM
      try {
        await page.locator('.onetrust-pc-dark-filter').waitFor({
          state: 'detached',
          timeout: 5000
        });
        console.log('✓ OneTrust overlay removed');
      } catch (e) {
        // Overlay might not exist or already removed
        console.log('ℹ OneTrust overlay check skipped (may not exist)');
      }

      // Additional wait for any animations to complete
      await page.waitForTimeout(1000);

      return true;
    }

    // Try standard Accept button patterns as fallback
    const acceptButtonPatterns = ['Accept', 'Accept All', 'I Accept', 'Agree'];
    for (const pattern of acceptButtonPatterns) {
      const button = page.getByRole('button', { name: new RegExp(pattern, 'i') });
      const count = await button.count();

      if (count > 0) {
        const visible = await button.first().isVisible({ timeout: 1000 }).catch(() => false);
        if (visible) {
          await button.first().click();
          console.log(`✓ Clicked ${pattern} button`);
          await page.waitForTimeout(1000);
          return true;
        }
      }
    }

    console.log('ℹ No cookie banner found');
    return false;
  } catch (error) {
    console.log('⚠ Cookie dismissal error:', error instanceof Error ? error.message : 'unknown');
    return false;
  }
}


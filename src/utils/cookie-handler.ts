import { Page } from '@playwright/test';

/**
 * Dismisses OneTrust cookie banner and waits for overlay to be removed.
 *
 * This function implements a multi-strategy approach to handle cookie consent:
 * 1. First checks for OneTrust Accept button (primary strategy)
 * 2. Falls back to standard Accept button patterns
 * 3. Waits for overlay removal to prevent interaction blocking
 *
 * @param page - Playwright page object
 * @returns Promise<boolean> - true if cookie banner was dismissed, false if not found
 *
 * @example
 * ```typescript
 * const page = await browser.newPage();
 * const dismissed = await dismissCookieBanner(page);
 * if (dismissed) {
 *   console.log('Cookie banner handled successfully');
 * }
 * ```
 */
export async function dismissCookieBanner(page: Page): Promise<boolean> {
  try {
    // Wait a bit for the cookie banner to potentially appear
    await page.waitForTimeout(1500);

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
        console.log('⚠ OneTrust overlay check skipped (may not exist)');
      }

      // Additional wait for any animations to complete
      await page.waitForTimeout(500);

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
          await page.waitForTimeout(500);
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

/**
 * Ensures no cookie overlay is blocking interactions by immediately removing it via JavaScript.
 *
 * This function should be called before performing clicks or other interactions that might
 * be blocked by cookie overlays. Unlike dismissCookieBanner(), this function:
 * - Executes immediately without visibility checks (faster)
 * - Removes overlay from DOM completely
 * - Hides the cookie banner container
 * - Resets body scroll locks
 *
 * Best Practice: Call this function:
 * - Right before clicking critical UI elements
 * - Multiple times if overlay can reappear dynamically
 * - In step definitions that interact with blocked elements
 *
 * @param page - Playwright page object
 * @returns Promise<void> - Resolves when overlay removal is complete
 *
 * @example
 * ```typescript
 * // Before clicking a button that might be blocked
 * await ensureNoCookieOverlay(page);
 * await page.click('#search-button');
 * ```
 */
export async function ensureNoCookieOverlay(page: Page): Promise<void> {
  try {
    // Immediately remove overlay via JavaScript without waiting for visibility check
    // This is more reliable as the overlay might be in the DOM but not yet visible
    await page.evaluate(() => {
      // Remove overlay
      const overlayEl = document.querySelector('.onetrust-pc-dark-filter');
      if (overlayEl) {
        overlayEl.remove();
        console.log('Removed overlay element');
        return true;
      }

      // Also hide the cookie banner itself if still present
      const banner = document.querySelector('#onetrust-consent-sdk');
      if (banner) {
        (banner as HTMLElement).style.display = 'none';
        console.log('Hidden cookie banner');
      }

      // Remove body scroll lock if applied
      document.body.style.overflow = '';

      return false;
    }).then(removed => {
      if (removed) {
        console.log('✓ Cookie overlay removed via JavaScript');
      }
    });

    // Small wait for DOM updates to stabilize
    await page.waitForTimeout(100);
  } catch (error) {
    // Error occurred, but continue - better to attempt interaction than fail
  }
}


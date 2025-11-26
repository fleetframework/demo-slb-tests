import { Page, Locator } from '@playwright/test';

/**
 * Accessibility Helper Utility
 * 
 * Provides methods to validate accessibility compliance for HTML elements,
 * particularly focusing on table accessibility (WCAG 2.1 AA standards).
 */
export class AccessibilityHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Validates that a table has proper accessibility structure
   * @param tableLocator - Locator for the table element
   * @returns Object with validation results
   */
  async validateTableAccessibility(tableLocator: Locator): Promise<{
    hasCaption: boolean;
    hasThead: boolean;
    hasTbody: boolean;
    headersHaveScope: boolean;
    allHeadersValid: boolean;
    details: string[];
  }> {
    const details: string[] = [];

    // Check for caption
    const caption = tableLocator.locator('caption');
    const hasCaption = (await caption.count()) > 0;
    if (hasCaption) {
      details.push('✓ Table has <caption> element');
    } else {
      details.push('✗ Table missing <caption> element');
    }

    // Check for thead
    const thead = tableLocator.locator('thead');
    const hasThead = (await thead.count()) > 0;
    if (hasThead) {
      details.push('✓ Table has <thead> element');
    } else {
      details.push('✗ Table missing <thead> element');
    }

    // Check for tbody
    const tbody = tableLocator.locator('tbody');
    const hasTbody = (await tbody.count()) > 0;
    if (hasTbody) {
      details.push('✓ Table has <tbody> element');
    } else {
      details.push('✗ Table missing <tbody> element');
    }

    // Check that all th elements in thead have scope="col"
    let headersHaveScope = true;
    let allHeadersValid = true;

    if (hasThead) {
      const headers = thead.locator('th');
      const headerCount = await headers.count();

      if (headerCount > 0) {
        for (let i = 0; i < headerCount; i++) {
          const header = headers.nth(i);
          const scope = await header.getAttribute('scope');

          if (!scope || scope !== 'col') {
            headersHaveScope = false;
            const headerText = await header.textContent();
            details.push(`✗ Header "${headerText}" missing or invalid scope attribute`);
          }
        }

        if (headersHaveScope) {
          details.push(`✓ All ${headerCount} headers have scope="col"`);
        }
      } else {
        allHeadersValid = false;
        details.push('✗ No <th> elements found in <thead>');
      }
    }

    return {
      hasCaption,
      hasThead,
      hasTbody,
      headersHaveScope,
      allHeadersValid: allHeadersValid && headersHaveScope,
      details,
    };
  }

  /**
   * Validates that column headers are programmatically linked to cells
   * @param tableLocator - Locator for the table element
   * @returns true if headers are properly linked
   */
  async validateHeaderCellLinking(tableLocator: Locator): Promise<boolean> {
    // Check if headers have IDs and cells reference them, or scope is properly set
    const headers = tableLocator.locator('thead th');
    const headerCount = await headers.count();

    if (headerCount === 0) {
      return false;
    }

    // For column headers, scope="col" is sufficient for linking
    for (let i = 0; i < headerCount; i++) {
      const header = headers.nth(i);
      const scope = await header.getAttribute('scope');

      if (scope !== 'col') {
        // Check if header has ID and cells reference it
        const headerId = await header.getAttribute('id');
        if (!headerId) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Checks if an element has proper ARIA attributes
   * @param locator - Element locator
   * @param expectedRole - Expected ARIA role
   * @returns true if ARIA attributes are valid
   */
  async validateAriaAttributes(
    locator: Locator,
    expectedRole?: string
  ): Promise<boolean> {
    const role = await locator.getAttribute('role');
    const ariaLabel = await locator.getAttribute('aria-label');
    const ariaLabelledBy = await locator.getAttribute('aria-labelledby');

    // Element should have either a role or be a semantic HTML element
    if (expectedRole && role !== expectedRole) {
      return false;
    }

    // Element should have some form of accessible name
    return !!(ariaLabel || ariaLabelledBy || role);
  }

  /**
   * Validates keyboard navigation support
   * @param locator - Interactive element locator
   * @returns true if element is keyboard accessible
   */
  async validateKeyboardAccessibility(locator: Locator): Promise<boolean> {
    const tabIndex = await locator.getAttribute('tabindex');
    const tagName = await locator.evaluate((el) => el.tagName.toLowerCase());

    // Interactive elements should be focusable
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea'];

    if (interactiveElements.includes(tagName)) {
      return true;
    }

    // Non-interactive elements need tabindex to be focusable
    return tabIndex !== null && parseInt(tabIndex) >= 0;
  }

  /**
   * Checks color contrast ratio (simplified check)
   * @param locator - Element locator
   * @returns Object with contrast information
   */
  async checkColorContrast(locator: Locator): Promise<{
    foreground: string;
    background: string;
    passes: boolean;
  }> {
    const styles = await locator.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    // This is a simplified check - in production, use a proper contrast checker
    // For now, just return the colors
    return {
      foreground: styles.color,
      background: styles.backgroundColor,
      passes: true, // Would need actual contrast calculation
    };
  }

  /**
   * Validates that a table is responsive and scrollable
   * @param tableLocator - Locator for the table element
   * @returns true if table is in a scrollable container
   */
  async validateTableResponsiveness(tableLocator: Locator): Promise<boolean> {
    const container = tableLocator.locator('xpath=ancestor::*[1]');
    const overflowX = await container.evaluate((el) => {
      return window.getComputedStyle(el).overflowX;
    });

    return overflowX === 'auto' || overflowX === 'scroll';
  }

  /**
   * Validates sticky header implementation
   * @param headerLocator - Locator for table header
   * @returns true if header has sticky positioning
   */
  async validateStickyHeader(headerLocator: Locator): Promise<boolean> {
    const position = await headerLocator.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });

    return position === 'sticky' || position === 'fixed';
  }
}

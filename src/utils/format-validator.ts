/**
 * Format Validator Utility
 * 
 * Provides methods to validate various data formats used in the application,
 * including currency, percentages, numbers, and custom formats.
 */
export class FormatValidator {
  /**
   * Validates currency format: $12,345.67
   * - Must start with $
   * - Must have thousands separators (,)
   * - Must have exactly 2 decimal places
   * @param value - String value to validate
   * @returns true if format is valid
   */
  static validateCurrencyFormat(value: string): boolean {
    // Pattern: $1,234.56 or $1,234,567.89
    // Allows for optional negative sign: -$1,234.56
    const currencyPattern = /^-?\$\d{1,3}(,\d{3})*\.\d{2}$/;
    return currencyPattern.test(value.trim());
  }

  /**
   * Validates percentage format: +5.25% or -1.10%
   * - Must have + or - sign
   * - Must have exactly 2 decimal places
   * - Must end with %
   * @param value - String value to validate
   * @returns true if format is valid
   */
  static validatePercentageFormat(value: string): boolean {
    // Pattern: +5.25% or -1.10%
    const percentagePattern = /^[+-]\d+\.\d{2}%$/;
    return percentagePattern.test(value.trim());
  }

  /**
   * Validates shares format: 100.0000
   * - Must have up to 4 decimal places
   * - Can be whole number or decimal
   * @param value - String value to validate
   * @returns true if format is valid
   */
  static validateSharesFormat(value: string): boolean {
    // Pattern: 100.0000 or 100 or 100.5 or 100.50 or 100.500 or 100.5000
    const sharesPattern = /^\d+(\.\d{1,4})?$/;
    return sharesPattern.test(value.trim());
  }

  /**
   * Validates split adjustment format: 2:1 or 3:2
   * - Must be in ratio format (number:number)
   * - Both numbers must be positive integers
   * @param value - String value to validate
   * @returns true if format is valid
   */
  static validateSplitAdjustmentFormat(value: string): boolean {
    // Pattern: 2:1 or 3:2 or N/A or None or -
    const trimmedValue = value.trim();

    // Allow N/A, None, or - for no split
    if (trimmedValue === 'N/A' || trimmedValue === 'None' || trimmedValue === '-') {
      return true;
    }

    // Pattern: 2:1
    const splitPattern = /^\d+:\d+$/;
    return splitPattern.test(trimmedValue);
  }

  /**
   * Validates date format: YYYY-MM-DD or MM/DD/YYYY
   * @param value - String value to validate
   * @returns true if format is valid
   */
  static validateDateFormat(value: string): boolean {
    // Pattern: 2023-06-15 or 06/15/2023
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const usDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;

    const trimmedValue = value.trim();
    return isoDatePattern.test(trimmedValue) || usDatePattern.test(trimmedValue);
  }

  /**
   * Extracts numeric value from currency string
   * @param currencyString - Currency string (e.g., "$12,345.67")
   * @returns Numeric value
   */
  static parseCurrency(currencyString: string): number {
    // Remove $, commas, and parse as float
    const cleaned = currencyString.replace(/[$,]/g, '');
    return parseFloat(cleaned);
  }

  /**
   * Extracts numeric value from percentage string
   * @param percentageString - Percentage string (e.g., "+5.25%")
   * @returns Numeric value
   */
  static parsePercentage(percentageString: string): number {
    // Remove % and parse as float
    const cleaned = percentageString.replace('%', '');
    return parseFloat(cleaned);
  }

  /**
   * Extracts numeric value from shares string
   * @param sharesString - Shares string (e.g., "100.0000")
   * @returns Numeric value
   */
  static parseShares(sharesString: string): number {
    return parseFloat(sharesString);
  }

  /**
   * Validates that a value is within expected range
   * @param value - Numeric value
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns true if value is within range
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Validates all currency values in an array
   * @param values - Array of currency strings
   * @returns Object with validation results
   */
  static validateAllCurrencyValues(values: string[]): {
    allValid: boolean;
    invalidValues: string[];
  } {
    const invalidValues: string[] = [];

    for (const value of values) {
      if (!this.validateCurrencyFormat(value)) {
        invalidValues.push(value);
      }
    }

    return {
      allValid: invalidValues.length === 0,
      invalidValues,
    };
  }

  /**
   * Validates all percentage values in an array
   * @param values - Array of percentage strings
   * @returns Object with validation results
   */
  static validateAllPercentageValues(values: string[]): {
    allValid: boolean;
    invalidValues: string[];
  } {
    const invalidValues: string[] = [];

    for (const value of values) {
      if (!this.validatePercentageFormat(value)) {
        invalidValues.push(value);
      }
    }

    return {
      allValid: invalidValues.length === 0,
      invalidValues,
    };
  }

  /**
   * Validates all shares values in an array
   * @param values - Array of shares strings
   * @returns Object with validation results
   */
  static validateAllSharesValues(values: string[]): {
    allValid: boolean;
    invalidValues: string[];
  } {
    const invalidValues: string[] = [];

    for (const value of values) {
      if (!this.validateSharesFormat(value)) {
        invalidValues.push(value);
      }
    }

    return {
      allValid: invalidValues.length === 0,
      invalidValues,
    };
  }
}

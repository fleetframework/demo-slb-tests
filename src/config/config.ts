import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object
 *
 * Configuration is loaded from environment variables with sensible defaults.
 * Override settings by creating a .env file (use .env.example as template).
 */
export const config = {
  /** Base URL for the application under test */
  baseURL: process.env.BASE_URL || 'https://www.slb.com',

  /** Run browser in headless mode (no visible UI) */
  headless: process.env.HEADLESS !== 'false',

  /**
   * Run all scenarios in a single browser session (default: true)
   * - true: Faster execution, lower resource usage, cookies dismissed once
   * - false: Complete isolation between scenarios, slower but clean state
   */
  singleSession: process.env.SINGLE_SESSION !== 'false', // Default: true

  /** Default timeout for actions in milliseconds */
  timeout: 60000,

  /** Default viewport size for browser */
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
};


import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './features',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.slb.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: process.env.HEADLESS !== 'false',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});


# SLB Website Test Automation Framework

A professional test automation framework for SLB website testing using TypeScript, Cucumber (BDD), and Playwright.

## 🎯 Features

- **BDD Approach**: Behavior-Driven Development with Cucumber and Gherkin syntax
- **TypeScript**: Type-safe test automation with full IntelliSense support
- **Playwright**: Modern, reliable browser automation across Chromium, Firefox, and WebKit
- **Page Object Model**: Maintainable test architecture with reusable page objects
- **Single Session Mode**: Optional feature to run all scenarios in one browser session (50-60% faster)
- **Robust Cookie Handling**: Automatic OneTrust cookie consent management with multi-strategy approach
- **Resilient Interactions**: Smart click strategies (normal → JavaScript → navigation) to handle overlays
- **Rich Reporting**: HTML, JSON, and JUnit reports with screenshots and videos on failure
- **Code Quality**: ESLint and Prettier for consistent code style
- **CI/CD Ready**: Configured for continuous integration pipelines

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd slb-tests
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Set up environment variables:
```bash
cp .env.example .env
```

## 📁 Project Structure

```
slb-tests/
├── features/                    # Cucumber feature files (BDD scenarios)
│   ├── homepage-navigation.feature
│   ├── content-verification.feature
│   └── search.feature          # Search functionality tests
├── src/
│   ├── pages/                   # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   └── ContactPage.ts
│   ├── steps/                   # Cucumber step definitions
│   │   ├── homepage-steps.ts
│   │   ├── content-steps.ts
│   │   └── search-steps.ts     # Search-related steps
│   ├── support/                 # Test support files
│   │   ├── browser.ts          # Browser management
│   │   ├── hooks.ts            # Cucumber hooks
│   │   └── report-generator.js # Report generation
│   ├── utils/                   # Utility functions
│   │   └── cookie-handler.ts   # Cookie banner handling
│   └── config/                  # Configuration files
│       └── config.ts
├── reports/                     # Test reports and artifacts
├── cucumber.js                  # Cucumber configuration
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json

```

## 🧪 Running Tests

### Run all tests:
```bash
npm test
```

### Run tests with HTML report:
```bash
npm run test:all
```

### Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

### Run specific feature:
```bash
npx cucumber-js features/homepage-navigation.feature
```

### Run specific scenario by line:
```bash
npx cucumber-js features/homepage-navigation.feature:10
```

## 📊 Reports

After running tests, reports are generated in the `reports/` directory:

- **HTML Report**: `reports/index.html` - Interactive HTML report with test results
- **JSON Report**: `reports/cucumber-report.json` - Machine-readable test results
- **JUnit Report**: `reports/cucumber-report.xml` - For CI/CD integration
- **Screenshots**: Captured automatically on test failures
- **Videos**: Recorded for failed test scenarios

To generate the HTML report after tests:
```bash
npm run test:report
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```env
BASE_URL=https://www.slb.com
HEADLESS=true
SINGLE_SESSION=true  # Run all scenarios in one browser session (default: true)
```

**Configuration Options:**
- `BASE_URL`: The base URL for the application under test
- `HEADLESS`: Run browser in headless mode (`true`) or headed mode (`false`)
- `SINGLE_SESSION`: Run all scenarios in single browser session (`true`) or create new browser per scenario (`false`)
  - **Default: `true`** - Faster execution, lower resource usage
  - Set to `false` for complete isolation between scenarios

**Performance Impact:**
- `SINGLE_SESSION=true`: ~50-60% faster execution time
- `SINGLE_SESSION=false`: Complete scenario isolation, slower but ensures clean state

See [SINGLE_SESSION_FEATURE.md](./SINGLE_SESSION_FEATURE.md) for detailed documentation.

### Playwright Configuration

Modify `playwright.config.ts` to customize:
- Browsers (Chromium, Firefox, WebKit)
- Timeouts
- Screenshots and video settings
- Base URL
- Parallel execution

### Cucumber Configuration

Modify `cucumber.js` to customize:
- Report formats
- Step definition paths
- Feature file locations
- Retry attempts

## 🏗️ Best Practices Implemented

### 1. **Page Object Model (POM)**
- Encapsulates page elements and actions
- Promotes code reusability and maintainability
- Reduces code duplication

### 2. **BDD with Cucumber**
- Human-readable test scenarios
- Collaboration between technical and non-technical stakeholders
- Living documentation

### 3. **TypeScript**
- Type safety and early error detection
- Better IDE support and autocomplete
- Improved code quality

### 4. **Separation of Concerns**
- Page Objects: UI interactions
- Step Definitions: Test logic
- Feature Files: Test scenarios
- Support Files: Utilities and hooks

### 5. **Test Data Management**
- Environment-based configuration
- Externalized test data
- Configurable base URLs

### 6. **Error Handling**
- Screenshots on failure
- Video recording for debugging
- Detailed error messages in reports

### 7. **Code Quality**
- ESLint for code linting
- Prettier for code formatting
- Consistent coding standards

### 8. **CI/CD Ready**
- JUnit XML reports for integration
- Environment variable support
- Headless execution by default

### 9. **Simplified Cookie Banner Handling**
- Automatic dismissal of OneTrust cookie consent on first page load
- Handled once in Before hook when browser starts
- No need for per-test cookie checks
- Cookies persist across entire test session
- Prevents test flakiness without performance overhead

### 10. **Clean Test Code**
- Step definitions focused on business logic
- No cookie handling code in tests
- Infrastructure concerns separated in hooks
- Easy to read and maintain

## 🎯 Implemented Test Scenarios

### Homepage Navigation
- ✅ Homepage loads successfully
- ✅ Main sections visibility verification
- ✅ Navigation menu interactions
- ✅ Contact page navigation

### Content Verification
- ✅ Hero section content validation
- ✅ Company tagline verification
- ✅ CTA button presence checks

### Search Functionality
- ✅ Search panel opening
- ✅ Search input field availability
- ✅ Popular searches navigation
- ✅ Search query execution
- ✅ Results page validation

## 🧹 Code Quality

### Lint code:
```bash
npm run lint
```

### Fix linting issues:
```bash
npm run lint:fix
```

### Format code:
```bash
npm run format
```

### Clean reports:
```bash
npm run clean
```

## 📝 Writing Tests

### 1. Create a Feature File

Create a new `.feature` file in the `features/` directory:

```gherkin
Feature: Feature Name
  As a user
  I want to do something
  So that I can achieve a goal

  Scenario: Scenario name
    Given I am on the homepage
    When I click on a button
    Then I should see the result
```

### 2. Create a Page Object

Create a new page class in `src/pages/`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myElement = '#element';

  constructor(page: Page) {
    super(page);
  }

  async clickElement(): Promise<void> {
    await this.click(this.myElement);
  }
}
```

### 3. Create Step Definitions

Create step definitions in `src/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { MyPage } from '../pages/MyPage';
import { getPage } from '../support/browser';

let myPage: MyPage;

Given('I am on my page', async function () {
  const page = getPage();
  myPage = new MyPage(page);
  await myPage.navigate();
});
```

## 🐛 Troubleshooting

### Tests failing with cookie banner visible
- Cookies are automatically accepted when browser first starts (Before hook)
- Check console logs for "✓ Initial page loaded and cookies accepted"
- If cookie banner persists, check `src/utils/cookie-handler.ts`
- Verify the OneTrust button selector is still valid
- Cookie acceptance happens once per session in single session mode

### Tests failing with timeout errors
- Increase timeout in `playwright.config.ts`
- Check network connectivity
- Verify the website is accessible

### Browser not launching
- Reinstall browsers: `npx playwright install`
- Check system requirements
- Try running in headed mode: `npm run test:headed`

### TypeScript compilation errors
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` configuration
- Verify all imports are correct

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/tests.yml`:

```yaml
name: Test Automation

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:all
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-reports
          path: reports/
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🛠️ Tech Stack

### Core Technologies
- **TypeScript 5.9+**: Type-safe test automation
- **Playwright 1.57+**: Cross-browser automation framework
- **Cucumber 12.2+**: BDD testing framework with Gherkin syntax
- **Node.js 18+**: JavaScript runtime

### Development Tools
- **ESLint**: Code quality and style checking
- **Prettier**: Code formatting
- **ts-node**: TypeScript execution
- **dotenv**: Environment variable management

### Reporting
- **multiple-cucumber-html-reporter**: Rich HTML reports
- **Cucumber JSON**: Machine-readable test results
- **JUnit XML**: CI/CD integration format

### Architecture Patterns
- **Page Object Model (POM)**: UI abstraction layer
- **Behavior-Driven Development (BDD)**: Human-readable scenarios
- **Separation of Concerns**: Modular, maintainable codebase
- **Configuration Management**: Environment-based settings
- **Robust Error Handling**: Screenshots, HTML dumps, detailed logs

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful test scenarios
3. Update documentation as needed
4. Run linting and formatting before committing
5. Ensure all tests pass

## 📄 License

ISC

## 👥 Authors

Test Automation Team

---

**Happy Testing! 🚀**

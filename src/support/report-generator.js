const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const reportDir = path.join(__dirname, '../reports');
const jsonReport = path.join(reportDir, 'cucumber-report.json');

// Check if report exists
if (fs.existsSync(jsonReport)) {
  report.generate({
    jsonDir: reportDir,
    reportPath: reportDir,
    reportName: 'SLB Test Automation Report',
    pageTitle: 'SLB Website Test Results',
    displayDuration: true,
    displayReportTime: true,
    metadata: {
      browser: {
        name: 'Chromium',
        version: 'Latest',
      },
      device: 'Local Machine',
      platform: {
        name: process.platform,
        version: process.version,
      },
    },
    customData: {
      title: 'Test Execution Info',
      data: [
        { label: 'Project', value: 'SLB Website Tests' },
        { label: 'Framework', value: 'Playwright + Cucumber' },
        { label: 'Language', value: 'TypeScript' },
        { label: 'Execution Date', value: new Date().toLocaleString() },
      ],
    },
  });

  console.log('✅ HTML Report generated successfully!');
  console.log(`📊 View report at: ${path.join(reportDir, 'index.html')}`);
} else {
  console.log('⚠️  No test results found. Run tests first.');
}


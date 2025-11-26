module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/cucumber-report.xml',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    publishQuiet: true,
    timeout: 60000, // 60 seconds timeout for steps
  },
};


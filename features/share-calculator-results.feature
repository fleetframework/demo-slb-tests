Feature: Share Calculator Results Table
  As a user of the Share/Stock Calculator
  I want the results table to render accessibly and update dynamically

  Scenario: Results table renders correctly and is accessible after submitting valid inputs
    Given I open the Share Calculator page
    When I enter valid inputs for shares and date and submit the form
    Then I should see an accessible results table rendered dynamically without a page reload
    And a loading indicator should appear and disappear during calculation when present
    And the results table should contain column headers and at least one result row
    And the page URL should not change after submission

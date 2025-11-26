Feature: Results Table Render and Accessibility
  Ensure the results table renders correctly with accessible markup, proper formatting, and responsiveness.

  Scenario: Verify table renders with specified columns
    Given I navigate to the Stock/Share Calculator page
    When I enter "100" into the Shares input field
    And I enter "2023-06-15" into the Date input field
    And I submit the form
    Then the results table should render with the following columns:
      | Investment Date |
      | Original Shares |
      | Original Value |
      | Current Shares  |
      | Current Value   |
      | % Return        |
      | Split Adjustment|
      | Current Price   |

  Scenario: Validate table markup for accessibility
    Given I navigate to the Stock/Share Calculator page
    When I submit the form
    Then the table should have proper accessibility markup

  Scenario: Verify currency, percentage, shares, and split adjustment formatting
    Given I navigate to the Stock/Share Calculator page
    When I submit the form
    Then currency values should display with thousands separators and 2 decimals
    And percentages should display with sign and 2 decimals
    And shares should display up to 4 decimals
    And split adjustment should display as ratios

  Scenario: Validate table responsiveness and sticky headers
    Given I navigate to the Stock/Share Calculator page
    When I resize the viewport to 360px
    Then the table should support horizontal scrolling with sticky headers
    And no content or header truncation should occur

  Scenario: Verify table updates dynamically without page reload
    Given I navigate to the Stock/Share Calculator page
    When I enter "200" into the Shares input field
    And I enter "2023-07-01" into the Date input field
    And I submit the form
    Then the results table should update dynamically without page reload

  Scenario: Verify Empty, Loading, and Error states
    Given I navigate to the Stock/Share Calculator page
    When I have not submitted the form
    Then the table should display an Empty state message

    When I simulate a Loading state
    Then the table should display a Loading state message

    When I simulate an Error state
    Then the table should display an Error state message
Feature: SLB Homepage Navigation
  As a visitor to the SLB website
  I want to navigate through the homepage
  So that I can access information about SLB's services and products

  Background:
    Given I am on the SLB homepage

  Scenario: Homepage loads successfully
    Then I should see the main company heading
    And the navigation should be present
    And the page title should contain "SLB"

  Scenario: View key business sections
    Then I should see the "Decarbonizing Industry" section
    And I should see the "Innovating in Oil and Gas" section
    And I should see the "Scaling New Energy Systems" section

  Scenario: Verify interactive elements are present
    Then the "Log In" button should be visible
    And the language selector should be visible


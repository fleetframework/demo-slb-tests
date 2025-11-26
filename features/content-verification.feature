Feature: SLB Website Content Verification
  As a visitor to the SLB website
  I want to verify the website content and functionality
  So that I can ensure the site provides accurate information

  Background:
    Given I am on the SLB homepage

  Scenario: Verify homepage heading content
    Then the main heading should contain "global technology company"
    And the main heading should contain "energy innovation"
    And the main heading should contain "balanced planet"

  Scenario: Verify all business sections are present
    Then all four main business sections should be visible

  Scenario: Verify page is fully loaded and interactive
    Then the page should be fully loaded
    And all main content sections should be rendered


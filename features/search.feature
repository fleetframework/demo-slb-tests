Feature: SLB Website Search Functionality
  As a visitor to the SLB website
  I want to use the search functionality
  So that I can find information about products and services

  Background:
    Given I am on the SLB homepage

  Scenario: Open search panel
    When I click on the search button
    Then the search panel should be visible
    And the search input field should be present

  Scenario: Search for valve using popular searches
    When I click on the search button
    And I click on "valve" in popular searches
    Then I should be redirected to the search results page
    And the search results should be displayed
    And the search query should be "valve"

  Scenario: Search for valve using search input
    When I click on the search button
    And I enter "valve" in the search field
    And I submit the search
    Then I should be redirected to the search results page
    And the search results should be displayed


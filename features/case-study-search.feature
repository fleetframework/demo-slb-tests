Feature: Case Studies Search
  As a visitor
  I want to search case studies using keywords and filters
  So that I can find relevant case study documents

  Background:
    Given I am on the SLB homepage

  Scenario: Search case studies with keywords and filters
    When I open the search panel
    And I search for case studies with keyword "digital" 
    And I apply the following filters:
      | Filter    | Value           |
      | Content   | Case Studies    |
      | Region    | Asia Pacific    |
    Then I should see case studies in results with localized titles where available

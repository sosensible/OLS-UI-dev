// https://docs.cypress.io/api/introduction/api.html

describe("Layout Links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Login", () => {
    it("Login Button Links Test", () => {
      cy.get("header").contains("Login").click();
      cy.contains("h1", "Please sign in");
    });
  })
});

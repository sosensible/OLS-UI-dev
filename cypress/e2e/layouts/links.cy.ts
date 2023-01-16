// https://docs.cypress.io/api/introduction/api.html

describe("Layout Links", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Header Section", () => {
    it("Header Links Test", () => {
      cy.contains("h1", "Welcome to OLS");
      cy.contains("h2", "Open Learning Server");

      cy.get("header").contains("Learn").click();
      cy.contains("h1", "learning home");

      cy.get("header").contains("News").click();
      cy.contains("h1", "news page");

      cy.get("header").contains("About").click();
      cy.contains("h1", "about page");

      cy.get("header").contains("Home").click();
      cy.contains("h1", "Welcome to OLS");
    });
  })

  context("Footer Section", () => {
    it("Footer Links Test", () => {
      cy.contains("h1", "Welcome to OLS");

      cy.get("footer").contains("Learn").click();
      cy.contains("h1", "learning home");

      cy.get("footer").contains("News").click();
      cy.contains("h1", "news page");

      cy.get("footer").contains("About").click();
      cy.contains("h1", "about page");

      cy.get("footer").contains("Home").click();
      cy.contains("h1", "Welcome to OLS");
    });
  })

  context("Login", () => {
    it("Login Button Links Test", () => {
      cy.contains("h1", "Welcome to OLS");

      cy.get("header").contains("Login").click();
      cy.contains("h1", "Please sign in");
    });
  })

  context("User/Avatar Menu", () => {
    it("User/Avatar Menu Appears", () => {
      cy.contains("h1", "Welcome to OLS");
      cy.getByData("user-avatar").should("not.have.class", "show");
      cy.getByData("user-menu").should("not.have.class", "show");

      cy.getByData("user-avatar").click().should("have.class", "show");
      cy.getByData("user-menu").should("have.class", "show");
    });
  })
});

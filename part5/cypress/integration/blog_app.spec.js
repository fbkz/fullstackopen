describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("login to application");
    cy.contains("username");
    cy.contains("password");
    cy.get("#login-button").contains("login");
    cy.get("input").then((x) => {
      let inputs = x.get();
      expect(inputs).to.have.length(2);
    });
    cy.contains("password");
  });
});

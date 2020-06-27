describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");

    const user = {
      name: "Rasmus Winther",
      username: "g2caps",
      password: "g2capspassword",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("login to application");
    cy.contains("username");
    cy.contains("password");
    cy.get("#login-button");
    cy.get("input").then((x) => {
      let inputs = x.get();
      expect(inputs).to.have.length(2);
    });
    cy.contains("password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("g2caps");
      cy.get("#password").type("g2capspassword");
      cy.get("#login-button").click();
      cy.contains("Rasmus Winther logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("a");
      cy.get("#password").type("a");
      cy.get("#login-button").click();
      cy.get("#notification").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });
});

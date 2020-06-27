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

  describe.only("When logged in", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:3001/api/login", {
        username: "g2caps",
        password: "g2capspassword",
      }).then((response) => {
        localStorage.setItem("loggedUser", JSON.stringify(response.body));
        cy.visit("http://localhost:3000");
      });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("most dominant LoL team of the west");
      cy.get("#author").type("Carlos Ocelote");
      cy.get("#url").type("http://g2.com");
      cy.get("#create-button").click();
      cy.get("#notification").should("have.css", "color", "rgb(0, 128, 0)");
      cy.contains("most dominant LoL team of the west");
      cy.contains("view");
    });

    it("A user can like a blog", function () {
      cy.request({
        url: "http://localhost:3001/api/blogs",
        method: "POST",
        body: {
          title: "most dominant LoL team of the west",
          author: "Carlos Ocelote",
          url: "http://g2.com",
        },
        headers: {
          Authorization: `bearer ${
            JSON.parse(localStorage.getItem("loggedUser")).token
          }`,
        },
      });
      cy.visit("http://localhost:3000");
      cy.contains("view").click();
      cy.contains("like").click();
      cy.get("#likes").contains("1");
    });
  });
});

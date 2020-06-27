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

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({
        username: "g2caps",
        password: "g2capspassword",
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
      cy.createBlog({
        title: "most dominant LoL team of the west",
        author: "Carlos Ocelote",
        url: "http://g2.com",
      });
      cy.visit("http://localhost:3000");

      cy.contains("view").click();
      cy.contains("like").click();
      cy.get(".likes").contains("1");
    });

    it("A user can delete a blog that he has created", function () {
      cy.createBlog({
        title: "most dominant LoL team of the west",
        author: "Carlos Ocelote",
        url: "http://g2.com",
      });
      cy.visit("http://localhost:3000");
      cy.contains("view").click();
      cy.contains("delete")
        .click()
        .should("not.contain", "most dominant LoL team of the west");
    });

    it("A user cannot delete a blog that has not created", function () {
      cy.createBlog({
        title: "most dominant LoL team of the west",
        author: "Carlos Ocelote",
        url: "http://g2.com",
      });
      cy.contains("logout").click();
      cy.createUser({
        name: "Luka Perkovic",
        username: "g2perkz",
        password: "g2perkzpassword",
      });
      cy.login({ username: "g2perkz", password: "g2perkzpassword" });
      cy.contains("view").click();
      cy.should("not.contain", "delete");
    });

    it("Blogs are ordered accordingly to likwa", function () {
      const likesValues = [165, 45, 25, 3];

      cy.createBlog({
        title: "most dominant LoL team of the west",
        author: "Carlos Ocelote",
        url: "http://g2.com",
        likes: likesValues[1],
      });
      cy.createBlog({
        title: "fnatic vs g2",
        author: "deficio",
        url: "http://lec.com",
        likes: likesValues[0],
      });
      cy.createBlog({
        title: "danya vs hik",
        author: "Alex",
        url: "http://chess.com",
        likes: likesValues[2],
      });
      cy.createBlog({
        title: "el clasico de espana",
        author: "Messi",
        url: "http://messi.com",
        likes: likesValues[3],
      });
      cy.visit("http://localhost:3000");
      cy.get(".view-button").each((el) => el.click());

      cy.get(".likes").then((x) => {
        let first = Number(x[0].innerText);
        let second = Number(x[1].innerText);
        let third = Number(x[2].innerText);
        let fourth = Number(x[3].innerText);

        expect([first, second, third, fourth]).to.have.ordered.members(
          likesValues
        );
      });
      //
    });
  });
});

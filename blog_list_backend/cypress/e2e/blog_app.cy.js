describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user1 = {
      name: "Success",
      username: "CBA",
      password: "sekretmystery",
    };
    const user2 = {
      name: "Failure",
      username: "IKR",
      password: "easypeasylemonsqueezy",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user1);
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user2);
    cy.visit("");
  });
  it("front page can be opened", function () {
    cy.contains("Blogs");
    cy.contains("made by Cajsa");
  });
  it("login form can be opened", function () {
    cy.contains("Log In").click();
    cy.contains("username");
    cy.contains("password");
  });
  it("logging in succeeds", function () {
    cy.login({ username: "CBA", password: "sekretmystery" });
    cy.contains("Success logged in");
  });
  it("Login fails with wrong password", function () {
    cy.contains("Log In").click();
    cy.get("#username").type("CBA");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();
    cy.get(".error")
      .should("contain", "Wrong")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "padding", "10px");
    cy.get("html").should("not.contain", "logged in");
  });

  describe("Order of blogs", function () {
    beforeEach(function () {
      cy.login({ username: "CBA", password: "sekretmystery" });
      cy.createBlog({
        title: "One like",
        author: "One",
        url: "one.com",
        likes: 1
      });
      cy.createBlog({
        title: "Two like",
        author: "Two",
        url: "two.com",
        likes: 2
      });
      cy.createBlog({
        title: "Three like",
        author: "Three",
        url: "three.com",
        likes: 3
      });
    })
    it.only("Blogs are orderd based on number of likes", function () {
      cy.get(".Blog").eq(0).should("contain", "Three like")
      cy.get(".Blog").eq(1).should("contain", "Two like")
      cy.get(".Blog").eq(2).should("contain", "One like")
    })
  })
  
  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "CBA", password: "sekretmystery" });
      cy.contains("Success logged in");
    });
    it("new blog can be created and liked", function () {
      cy.createBlog({
        title: "Blog about Cypress",
        author: "Civilian",
        url: "cy.com",
      });
      cy.contains("Blog about Cypress")
        .parent()
        .contains("button", "View")
        .click();
      cy.contains("Blog about Cypress").parent().contains("button", "Like").click();
      cy.contains("Blog about Cypress").parent().contains("1 likes");
    });
    it("a blog can be deleted", function () {
      cy.createBlog({
        title: "Blog about Cypress",
        author: "Civilian",
        url: "cy.com",
      });
      cy.contains("Blog about Cypress");
      cy.contains("View").click();
      cy.contains("Delete").click();
      cy.get(".blogs").should("not.contain", "Blog about Cypress");
    });
    it("logged in user cannot see delete-buttons for others blogs", function () {
      cy.createBlog({
        title: "Blog about Cypress",
        author: "Civilian",
        url: "cy.com",
      });
      cy.contains("Log out").click();
      cy.contains("Log In").click();
      cy.login({ username: "IKR", password: "easypeasylemonsqueezy" });
      cy.contains("Failure logged in");
      cy.contains("Blog about Cypress");
      cy.contains("View").click()
      cy.get(".Blog").should("not.contain", "Delete");
    });
  });
});

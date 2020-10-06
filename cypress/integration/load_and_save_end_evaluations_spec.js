describe("Load And Save End Evaluations", () => {
    it("Navigate to Register Assists", () => {
      cy.visit("http://localhost:8080/Planification");
  
      cy.wait(1000); //wait for Vue component mounted lifecycle
  
      cy.get("button")
        .contains("Registrar")
        .click();
      cy.url().should("eq", "http://localhost:8080/Tasks");
  
      cy.get("button")
        .last()
        .click();

        cy.get('table').should('not.be.empty')
    });
});
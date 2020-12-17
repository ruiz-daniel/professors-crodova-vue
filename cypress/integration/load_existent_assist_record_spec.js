describe("Load Existing Assist Record", () => {
  it("Navigate to Register Assists", () => {
    cy.visit("http://localhost:8080/Planification");

    cy.wait(1000); //wait for Vue component mounted lifecycle

    cy.get("button")
      .contains("Registrar")
      .click();
    cy.url().should("eq", "http://localhost:8080/Tasks");

    cy.get("button")
      .contains("Seleccionar Tarea")
      .click();
  });
  
  // it("Set existing date, week and activity type", () => {
  //   cy.get("#inputActType").type("Conferencia");
  //   cy.get("input")
  //     .first()
  //     .type("{selectall}{backspace}05/06/2020");
  //   cy.get("#inputWeek")
  //     .click()
  //     .contains("1")
  //     .click();

  //   cy.contains("Cargado registro de asistencia existente");
  // });

  it("Set new date, week and activity type and register", () => {
    cy.get("#inputActType").type("Conferencia");
    cy.get("input")
      .first()
      .type("{selectall}{backspace}06/06/2020");
    cy.get("#inputWeek")
      .click()
      .contains("2")
      .click();
    cy.get("button")
      .contains("Guardar Cambios")
      .click();
    cy.contains("Se han guardado las asistencias");
  });

  
});

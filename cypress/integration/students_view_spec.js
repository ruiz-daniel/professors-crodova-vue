describe('List Students Test', () => {
    it('Click on the students button shows the list of students', () => {
      cy.visit('http://localhost:8080/Planification')

      cy.wait(1000) //wait for Vue component mounted lifecycle

      cy.get('button').contains('Estudiantes').click()
      cy.url().should('eq', 'http://localhost:8080/StudentsView')

      cy.get('table').should('not.be.empty')
    })
  })
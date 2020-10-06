describe('Configuration Page Test', () => {
    it('Click button without fields gives an error message', () => {
      cy.visit('http://localhost:8080/')

      cy.wait(1000) //wait for Vue component mounted lifecycle

      cy.get('i').click()
      cy.contains('Configuraciones').click()

      cy.get('#host').type('localhost')
      cy.get('#username').type('drg')
      cy.get('#pass').type('123')

      cy.get('button').contains('Guardar').click()
      cy.contains('Se han guardado las configuraciones')
    })
  })
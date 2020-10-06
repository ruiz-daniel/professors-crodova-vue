describe('Configuration Page Test', () => {
    it('Click button without fields gives an error message', () => {
      cy.visit('http://localhost:8080/Configuration')

      cy.wait(1000) //wait for Vue component mounted lifecycle

      cy.get('button').contains('Conectar').click()
      cy.contains('Configure usuario y contraseña')
    })
  })
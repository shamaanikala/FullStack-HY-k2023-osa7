describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Meikäläinen',
      username: 'mmeika',
      password: 'salasana'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.get('html') // 'html' ~ näkyvät jutut
      .should('contain', 'log in to application')
      .and('not.contain', 'blogs')

    cy.contains('blogs').should('not.exist')

    // löytyykö itse lomake
    cy.get('form')
      .contains('username')
    cy.get('form')
      .should('contain', 'password')

    cy.get('form')
      .get('button')
      .should('have.text', 'login')
  })

  describe('Login',function() {
    it.only('succeeds with correct credentials', function() {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('salasana')
      cy.contains('login').click()

      cy.contains('blogs')
      cy.contains('Matti Meikäläinen logged in')
    })

  //   it('fails with wrong credentials', function() {
  //     // ...
  //   })
  })
})
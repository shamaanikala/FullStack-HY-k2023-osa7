describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
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
})
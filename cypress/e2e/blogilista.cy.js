describe('Blog app', function() {
  it('etusivu näkyy', function () {
    cy.visit('http://localhost:3000')
    // blogien ei pitäisi vielä näkyä
    //cy.contains('blogs') // ei mene läpi
    cy.get('html') // 'html' ~ näkyvät jutut
      .should('contain', 'log in to application')
      .and('not.contain', 'blogs')

    cy.contains('blogs').should('not.exist')
  })
  // beforeEach(function() {
  //   cy.request('POST', 'http://localhost:3003/api/testing/reset')
  //   cy.visit('http://localhost:3000')
  // })

  // it('Login form is shown', function() {
  //   // ...
  // })
})
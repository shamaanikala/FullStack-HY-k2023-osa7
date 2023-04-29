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
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('salasana')
      cy.contains('login').click()

      cy.contains('blogs')
      cy.contains('Matti Meikäläinen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('väärä-salasana')
      cy.contains('login').click()

      //cy.contains('wrong username or password')
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html')
        .should('not.contain', 'Matti Meikäläinen')
        .and('not.contain', 'logged in')
        .and('contain', 'log in to application')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('salasana')
      cy.contains('login').click()
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()

      cy.get('#title').type('Parsing Html The Cthulhu Way')
      cy.get('#author').type('Jeff Atwood')
      cy.get('#url').type('https://blog.codinghorror.com/parsing-html-the-cthulhu-way/')

      cy.get('#createButton').click()

      cy.contains('a new blog Parsing Html The Cthulhu Way by Jeff Atwood added')
      cy.contains('Parsing Html The Cthulhu Way')

      cy.get('.closed')
        .should('have.descendants','span').as('titleSpan')
      cy.get('@titleSpan').get('span')
        .should('have.class','blogTitle')
        .and('contain', 'Parsing Html The Cthulhu Way')
    })

    describe.only('when blog exists', function () {
      beforeEach(function () {
        cy.contains('create new blog').click()

        cy.get('#title').type('Blog title')
        cy.get('#author').type('Blog Author')
        cy.get('#url').type('http://localhost:3000')

        cy.get('#createButton').click()
      })
      it('can be opened from view-button to show more information', function () {
        cy.contains('view').click()

        cy.contains('likes')
      })
      it('can be opened from title to show more information', function () {
        cy.get('.blogTitle').click()

        cy.contains('likes')
      })
      describe.only('and the blog is opened for more information', function ()  {
        beforeEach(function () {
          cy.contains('view').click()
        })
        it('can be liked', function () {
          cy.get('#likes')
            .invoke('text')
            .then(initialLikes => {
              cy.contains('like').click()

              cy.get('#likes')
                .invoke('text')
                .should(finalLikes => {
                  expect(Number(finalLikes)).to.eq(Number(initialLikes)+1)
                })
            })
        })
      })
    })
  })
})
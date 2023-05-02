describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.createUser({ username: 'mmeika', name: 'Matti Meikäläinen', password: 'salasana' })
  })

  it('Login form is shown', function () {
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

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mmeika')
      cy.get('#password').type('salasana')
      cy.contains('login').click()

      cy.contains('blogs')
      cy.contains('Matti Meikäläinen logged in')
    })

    it('fails with wrong credentials', function () {
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
      cy.login({ username: 'mmeika', password: 'salasana' })
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
        .should('have.descendants', 'span').as('titleSpan')
      cy.get('@titleSpan').get('span')
        .should('have.class', 'blogTitle')
        .and('contain', 'Parsing Html The Cthulhu Way')
    })

    describe('when blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Blog title',
          author: 'Blog author',
          url: 'http://localhost:3000'
        })
      })
      it('can be opened from view-button to show more information', function () {
        cy.contains('view').click()

        cy.contains('likes')
      })
      it('can be opened from title to show more information', function () {
        cy.get('.blogTitle').click()

        cy.contains('likes')
      })
      describe('and the blog is opened for more information', function () {
        beforeEach(function () {
          cy.contains('view').click()
        })
        it('can be liked', function () {
          // https://docs.cypress.io/faq/questions/using-cypress-faq#How-do-I-get-an-elements-text-contents
          cy.get('#likes')
            .invoke('text')
            .then(initialLikes => {
              cy.contains('like').click()

              cy.get('#likes')
                .invoke('text')
                .should(finalLikes => {
                  expect(Number(finalLikes)).to.eq(Number(initialLikes) + 1)
                })
            })
        })
        it('can be liked twice', function () {
          cy.get('#likes')
            .invoke('text')
            .then(initialLikes => {
              cy.contains('like').click()
              //cy.contains('like').click() // löytää ilmoituksen "liked"
              //cy.wait(2000)

              // ei käytetä cy.wait() vaan odotetaan elementin muutosta
              cy.get('#likes')
                .invoke('text')
                .should('not.eq', initialLikes)

              cy.get('button').contains('like').click()

              cy.get('#likes')
                .invoke('text')
                .should(finalLikes => {
                  expect(Number(finalLikes)).to.eq(Number(initialLikes) + 2)
                })
            })
        })
        it('can be removed by the user', function () {
          cy.get('.removeButton').click()

          cy.get('.blogAdded')
            .should('contain', 'Removed the blog')
            .and('have.css', 'color', 'rgb(0, 128, 0)')
            .and('have.css', 'border-style', 'solid')

          cy.get('html')
            .should('not.contain', 'Blog title')
            .and('not.contain', 'Blog author')
            .and('not.contain', 'view')
        })

        it('can only be removed by the user who created it', function () {
          cy.contains('logout').click()
          cy.createUser({ username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' })
          cy.login({ username: 'mluukkai', password: 'salainen' })
          cy.contains('view').click()

          cy.get('.blogUser')
            .should('not.contain', 'Matti Luukkainen')
          cy.get('.removeButton').should('not.exist')
        })
      })
    })
    describe('when several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'Blog title', author: 'Blog author', url: 'http://localhost:3000' })
        cy.createBlog({ title: 'A Good Blog', author: 'Author A', url: 'http://localhost:3000' })
        cy.createBlog({ title: 'The Best Blog', author: 'Author B', url: 'http://localhost:3000' })
        cy.createBlog({ title: 'A Better Blog', author: 'Author C', url: 'http://localhost:3000' })
      })

      describe('blogs are ordered by likes', function () {
        it('when one blog within blogs without likes is liked, it is first', function () {
          cy.contains('The Best Blog')
            .parent().find('button').click()

          cy.contains('like').click()
          cy.contains('hide').click()

          // cy.get('.blogBox > span.blogTitle')
          cy.get('span.blogTitle').eq(0).should('contain', 'The Best Blog')
        })
        it('with two likes a blog will be the first from top', function () {
          cy.contains('The Best Blog').parent().find('button').click()
          cy.likeBlog('The Best Blog')
          cy.contains('hide').click()

          cy.contains('A Better Blog').parent()
            .find('button').contains('view').click()

          cy.likeBlog('A Better Blog')
          cy.likeBlog('A Better Blog')

          cy.get('span.blogTitle').eq(0).should('contain', 'A Better Blog')
        })
        // it.only('testataan request', async function () {
        //   const blogs = await cy.request('GET', `${Cypress.env('BACKEND')}/blogs`)
        //   console.log(blogs.body)
        //   const blogTitles = blogs.body.map(b => b.title)
        //   console.log(blogTitles)
        //   const lol = cy.get('.blogTitle').invoke('text')
        //   cy.log(lol)
        //   cy.get('.blogTitle')
        //     .then(() => {
        //       for (let i=0;i<blogTitles.length;i++) {
        //         cy.get('.blogTitle').eq(i).invoke('text').should('be.oneOf',blogTitles)
        //       }
        //     })
        // })
        it.only('with many more likes the blogs are ordered correctly', function () {
          //cy.contains('view').click({ multiple: true }) vain yksi

          // haetaan blogien otiskot palvelimelta
          cy.request('GET', `${Cypress.env('BACKEND')}/blogs`)
            .then((response) => {
              const blogTitles = response.body.map(b => b.title)
              for (let i = 0; i < blogTitles.length; i++) {
                cy.get('.blogTitle').eq(i).invoke('text').should('be.oneOf', blogTitles)
              }
            })

          // avataan kaikki
          cy.get('button#viewBlogButton')
            .then((buttons) => {
              for (let i = 0; i < buttons.length; i++) {
                buttons.eq(i).click()
              }
            })

          // tykätään satunnaisesti
          // otetaan satunnaislukufunktio täältä:
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
          function getRandomIntInclusive(min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
          }

          cy.request('GET', `${Cypress.env('BACKEND')}/blogs`)
            .then((response) => {
              const blogTitles = response.body.map(b => b.title)
              for (let title of blogTitles) {
                for (let n = 0; n < getRandomIntInclusive(0, 7); n++) {
                  cy.likeBlog(title)
                }
              }
            })
          // haetaan blogit palvelimelta ja järjestetään niiden otsikot tykkäysten mukaan
          // tarkistetaan järjestys
          cy.request('GET', `${Cypress.env('BACKEND')}/blogs`)
            .then((response) => {
              const blogsInLikesOrder = response.body.sort((a,b) => b.likes-a.likes)
              cy.log(blogsInLikesOrder)
              for (let i=0;i<blogsInLikesOrder.length;i++) {
                cy.get('.blogTitle').eq(i).invoke('text').should('equal',blogsInLikesOrder[i].title)
              }
            })
          // cy.likeBlog('A Better Blog')
          // for (let i=0;i<1;i++) {
          //   cy.likeBlog('A Better Blog')
          // }
          // for (let i=0;i<1;i++) {
          //   cy.likeBlog('Blog title')
          //   cy.likeBlog('A Good Blog')
          //   cy.likeBlog('A Better Blog')
          //   cy.likeBlog('The Best Blog')
          // }
          // for (let i=0;i<5;i++) {
          //   cy.likeBlog('The Best Blog')
          // }
        })
      })
    })
  })
})
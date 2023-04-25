import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('kun blogista näytetään vain vähän tietoja', () => {
  test('blogista renderöidään title', () => {
    const blog = {
      title: 'Testiblogi'
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('Testiblogi')
    expect(element).toBeDefined()
  })

  test('blogista ei renderöidä url', () => {
    const blog = {
      title: 'Testiblogi',
      url: 'https://localhost:3000',
    }

    const container = render(<Blog blog={blog} />).container

    screen.debug()

    // elementtiä ei löydy, joten querySelector palauttaa null
    const element = container.querySelector('.expanded')
    //console.log(element)
    expect(element).toBeNull()
  })
})

describe('kun blogin tietot näyttävää nappia on painettu', () => {
  let container

  const mockBlogUser = {
    username: 'testaaja',
    name: 'Testi Nimi',
    id: '6436a10e40980f329f08b00e'
  }

  const dummyBlog = {
    title: 'Parsing Html The Cthulhu Way Jeff Atwood',
    url: 'https://blog.codinghorror.com/parsing-html-the-cthulhu-way/',
    likes: 3,
    user: {
      username: 'testaaja',
      name: 'Testi Nimi',
      id: '6436a10e40980f329f08b00e'
    }
  }

  beforeEach(() => {
    container = render(
      <Blog blog={dummyBlog} user={mockBlogUser} />
    ).container
  })

  test('blogin url, liket ja käyttäjä näytetään', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const expanded = container.querySelector('.expanded')
    expect(expanded).toBeDefined()
  })

  test.todo('painettaessa piilotus-nappulaa, näkyy enää vain blogin title ja kirjoittaja')
})

test.todo('blogin otsikko toimii samoin kuin view/hide -nappula')
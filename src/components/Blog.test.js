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

    //screen.debug()

    // elementtiä ei löydy, joten querySelector palauttaa null
    const element = container.querySelector('.opened')
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

  test('blogin lisätiedot näytetään', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    //screen.debug()

    const opened = container.querySelector('.opened')
    expect(opened).not.toBeNull()
  })

  test('blogin url näytetään', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('https://',{ exact: false })

    expect(url).toHaveTextContent('https://blog.codinghorror.com/parsing-html-the-cthulhu-way/')
  })

  test('blogin likejen määrä näytetään', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    // laitetaan exact: false, koska tuo löytyy välilyönnillä "likes "
    const likes = await screen.findByText('likes',{ exact: false })

    expect(likes).toHaveTextContent('3')
  })

  test('blogin lisänneen käyttäjän nimi näytetään', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const blogUser = screen.getByText('Testi Nimi')

    expect(blogUser).toBeDefined()
  })

  test('painettaessa piilotus-nappulaa, näkyy enää vain blogin title ja kirjoittaja', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(container.querySelector('.opened')).not.toBeNull()

    const hideButton = screen.getByText('hide')
    await user.click(hideButton)

    const opened = container.querySelector('.opened')
    expect(opened).toBeNull()
  })
})

test('blogin otsikko toimii samoin kuin view/hide -nappula', async () => {
  const mockBlogUser = {
    username: 'testaaja',
    name: 'Testi Nimi',
    id: '6436a10e40980f329f08b00e'
  }

  const mockBlog = {
    title: 'Parsing Html The Cthulhu Way Jeff Atwood',
    url: 'https://blog.codinghorror.com/parsing-html-the-cthulhu-way/',
    likes: 3,
    user: {
      username: 'testaaja',
      name: 'Testi Nimi',
      id: '6436a10e40980f329f08b00e'
    }
  }

  let { container } = render(<Blog blog={mockBlog} user={mockBlogUser} />)
  const element = screen.getByText('Parsing Html The Cthulhu Way Jeff Atwood', { exact: false })

  expect(container.querySelector('.opened')).toBeNull()


  const user = userEvent.setup()
  await user.click(element)

  expect(container.querySelector('.opened')).toHaveClass('opened')
  expect(container.querySelector('.opened')).not.toBeNull()

  // piilotetaan vielä
  const openedElement = screen.getByText('Parsing Html The Cthulhu Way Jeff Atwood', { exact: false })
  await user.click(openedElement)

  expect(container.querySelector('.opened')).toBeNull()
})
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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
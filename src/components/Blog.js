import { useState } from "react"

const Blog = ({ blog }) => {

  const [blogOpen, setBlogOpen] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const anonymousStyle = {
    color: 'grey',
    fontStyle: 'italic'
  }

  // klikattavan tekstin idea tämän perusteella:
  // https://stackoverflow.com/questions/43630991/by-clicking-text-how-to-change-clicked-text-to-another-text-in-react-js
  // eli luultavasti melkein mihin tahansa tagiin voi lisätä onClick()

  const toggleBlog = () => {
    setBlogOpen(!blogOpen)
  }

  // const blogCreatorInformation = blog => {
  //   // blogin user-kenttä voi olla tyhjä, tällöin laitetaan vain Anonymous
  //   // heti blogin lisäämisen jälkeen backend ei ole vielä ehtinyt populatella yhdistää blogs ja users tietokantoja
  //   // jolloin blogin user-kenttä on vielä pelkkä id. Tällöin haetaan käyttäjän nimi sen lisänneen käyttäjän nimestä
  //   if ()
  //   return (
  //     blog.user ? <span>{blog.user.name}</span> : <span style={anonymousStyle}>Anonymous</span>
  //   )
  // }
  //{!blog.user && <span style={anonymousStyle}>Anonymous</span>}
  // {blog.user
  //   ? (blog.user.name
  //       ? <span>{blog.user.name}</span>
  //       : <span>{user.name}</span>)
  //   : <span>user.name</span>}

  return (
    <div style={blogStyle}>
      {!blogOpen &&
      <div>
        <span onClick={toggleBlog}>{blog.title} {blog.author}</span>
          <button onClick={toggleBlog}>view</button> 
      </div>}
      {blogOpen &&
      <div>
        <span onClick={toggleBlog}>{blog.title} {blog.author}</span>
          <button onClick={toggleBlog}>hide</button>
          <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
          <div>likes {blog.likes} <button onClick={() => console.log(`blogin ${blog.title} like-nappulaa painettu`)}>like</button></div>
          {!blog.user && <span style={anonymousStyle}>Anonymous</span>}
          {blog.user && <span>{blog.user.name}</span>}
      </div>
      }
    </div>
  )
}

export default Blog
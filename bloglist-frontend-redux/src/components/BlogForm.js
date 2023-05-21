import { useState } from 'react'
import { TextField } from '@mui/material'
import AddBlogButton from './MUI-components/AddBlogButton'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // jos haluaa placeholder tekstin kursiivilla, ei voi tehdä näin
  // vaan pitää tehdä erillinen tyylitiedosto
  // const blogFormStyle = {
  //   placeHolder : {
  //     fontStyle: 'italic'
  //   }
  // }

  const createNewBlog = async event => {
    event.preventDefault()
    try {
      await createBlog({
        title,
        author,
        url,
      })

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      if (error.message) {
        console.log(error.message)
      }
    }
  }

  return (
    <div className="blogForm">
      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
        <div>
          <TextField
            label="Blog title"
            size="small"
            variant="filled"
            value={title}
            id="title"
            onChange={event => setTitle(event.target.value)}
            placeholder="Type blog title..."
          />
        </div>
        <div>
          <TextField
            label="Blog author"
            size="small"
            variant="filled"
            value={author}
            id="author"
            onChange={event => setAuthor(event.target.value)}
            placeholder="Type blog author..."
          />
        </div>
        <div>
          <TextField
            label="Blog url"
            size="small"
            variant="filled"
            value={url}
            id="url"
            onChange={event => setUrl(event.target.value)}
            placeholder="Type blog url..."
          />
        </div>
        <AddBlogButton id="createButton">create</AddBlogButton>
      </form>
    </div>
  )
}

export default BlogForm

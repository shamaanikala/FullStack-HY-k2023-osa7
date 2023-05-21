import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const RemoveBlogButton = ({ blog, remove }) => {
  return (
    <Button
      className="removeButton"
      startIcon={<DeleteIcon />}
      onClick={() => remove(blog.id, blog.title, blog.author)}
    >
      remove blog
    </Button>
  )
}

export default RemoveBlogButton

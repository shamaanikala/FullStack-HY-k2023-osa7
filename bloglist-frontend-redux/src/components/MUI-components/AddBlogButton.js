import AddIcon from '@mui/icons-material/Add'
import { Button } from '@mui/material'

const AddBlogButton = props => {
  return (
    <Button variant="contained" size="small" endIcon={<AddIcon />} id={props.id} type="submit">
      {props.children}
    </Button>
  )
}

export default AddBlogButton

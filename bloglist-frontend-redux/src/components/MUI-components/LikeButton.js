import { Button } from '@mui/material'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'

const LikeButton = ({ handleLike }) => {
  return (
    <Button
      title="Like the blog!"
      variant="outlined"
      className="likeButton"
      endIcon={<ArrowCircleUpIcon />}
      onClick={handleLike}
    >
      like
    </Button>
  )
}

export default LikeButton

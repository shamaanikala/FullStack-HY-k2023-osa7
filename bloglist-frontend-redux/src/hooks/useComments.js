import { useQuery, useMutation } from 'react-query'
import commentsService from '../services/comments'
import { useLocation } from 'react-router-dom'

export const useComments = blog => {
  const getComments = async id => commentsService.getByBlogId(id)

  const commentMutation = useMutation(commentsService.create)

  // const addComment = async (id, comment) => {
  //   const newComment = { content: comment, blog: id }
  //   await commentsService.create(newComment)
  // }

  // sivu ei toimi sivun päivityksen jälkeen, koska blogin id hukkuu
  // käytetään avuksi react-router-dom useLocation
  const location = useLocation()
  const backupId = location.pathname.split('/').pop()

  const id = !blog ? backupId : blog.id

  const query = useQuery('comments', () => getComments(id).then(res => res))

  const data = query.isSuccess ? query.data : null

  return {
    query,
    data,
    commentMutation,
  }
}

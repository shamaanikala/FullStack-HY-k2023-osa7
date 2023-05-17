import axios from 'axios'
const baseUrl = '/api/comments'

const getByBlogId = async blogId => {
  const response = await axios.get(`${baseUrl}/${blogId}`)
  return response.data
}

export default { getByBlogId }

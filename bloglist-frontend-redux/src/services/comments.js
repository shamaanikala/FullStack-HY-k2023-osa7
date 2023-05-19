import axios from 'axios'
//const baseUrl = '/api/comments'
const baseUrl = '/api/blogs'

const getByBlogId = async blogId => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}

export default { getByBlogId }

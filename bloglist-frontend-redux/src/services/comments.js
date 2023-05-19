import axios from 'axios'
//const baseUrl = '/api/comments'
const baseUrl = '/api/blogs'

const getByBlogId = async blogId => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}

const create = async commentObject => {
  console.log(`comments.js -create : ${JSON.stringify(commentObject)}`)

  const blogId = commentObject.blog

  const response = await axios.post(`${baseUrl}/${blogId}/comments`, commentObject)
  return response.data
}

export default { getByBlogId, create }

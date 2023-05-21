import axios from 'axios'
const baseUrl = '/api/blogs'

const getByBlogId = async blogId => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}

const create = async commentObject => {
  console.log(`comments.js -create : ${JSON.stringify(commentObject)}`)

  const blogId = commentObject.blog

  // prettier-ignore
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, commentObject).catch(error => {
    // jos tässä laittaa throw eikä return, niin tulee react_devtools_backend_compact.js:2367 konsoliin, joka katoaa, jos tässä laittaa return
    throw error.response.data.name === 'ValidationError'
      ? new Error(error.response.data.message)
      : error
  })
  return response.data
}

export default { getByBlogId, create }

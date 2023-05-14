import axios from 'axios'
const baseUrl = '/api/blogs'

// TODO token pois täältä -> login.js ?
let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// tätä ei ole backendissä toteutettu
const get = async id => {
  const response = await axios.get(`${baseUrl}`)
  return response.data.find(blog => blog.id === id)
}

const create = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(`blogs.js -create : ${JSON.stringify(blogObject)}`)

  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const like = async (id, blogObject) => {
  console.log(
    `Tykätään blogista ${blogObject.title}, tykkäyksiä: ${blogObject.likes} (id: request: ${id}, blog: ${blogObject.id})`
  )
  const config = {
    headers: { Authorization: token },
  }
  console.log(`blogs.js -like : ${JSON.stringify(blogObject)}`)

  try {
    const response = await axios.put(`${baseUrl}/${id}`, blogObject, config)
    return response.data
  } catch (error) {
    if (error.response.status === 404) {
      throw error
    }
  }
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(`blogs.js -remove : ${id}`)

  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  } catch (error) {
    if (error.response.status === 404) {
      throw error
    }
    throw error
  }
}

//// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, get, setToken, create, like, remove }

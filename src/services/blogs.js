import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async blogObject => {
  //console.log(blogObject)
  //console.log(token)
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

  const response = await axios.put(`${baseUrl}/${id}`, blogObject,config)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(`blogs.js -remove : ${id}`)

  const response = await axios.delete(`${baseUrl}/${id}`,config)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create, like, remove }
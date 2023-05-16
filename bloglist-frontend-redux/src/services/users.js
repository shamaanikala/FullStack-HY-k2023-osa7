import axios from 'axios'
const baseUrl = '/api/users'

// ei tehdä yleistä palvelu-komponenttia, koska tähän riittää vain get

const getAll = async () => {
  const response = await axios.get(baseUrl)
  // console.log(response)
  // console.log(response.data)
  return response.data
}

export default { getAll }

import axios from 'axios'
const baseUrl = '/api/users'

// ei tehdä yleistä palvelu-komponenttia, koska tähän riittää vain get

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }

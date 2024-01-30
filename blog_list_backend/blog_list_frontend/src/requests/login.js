import axios from 'axios'
const URL = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(URL, credentials)
  return response.data
}

export default { login }
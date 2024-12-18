import axios from 'axios'

const url = '/api/login'

const login = async (credentials) => {
  try {
    const response = await axios.post(url, credentials)
    return response.data
  } catch (error) {
    console.error(error.message)
  }
}

export default { login }
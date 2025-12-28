// import axios from 'axios'
// import { BASE_URL } from '@/config'
import api from './AxiosInterceptors'

class ApiService {
  constructor() {
    this.setHeader(localStorage.getItem('access_token'))
  }

  async get(endpoint) {
    const response = await api.get(endpoint)
    return response.data
  }

  async post(endpoint, data) {
    const response = await api.post(endpoint, data)
    return response.data
  }
  async patch(endpoint, data) {
    const response = await api.patch(endpoint, data)
    return response.data
  }
  async delete(endpoint) {
    const response = await api.delete(endpoint)
    return response.data
  }
  async request(req) {
    // alert('here')
    const response = await api.request(req)
    return response.data
  }
  setHeader(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }
  removeHeader() {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('access_token')
    localStorage.removeItem('role')
    localStorage.removeItem('avatar')
  }
}

export default ApiService

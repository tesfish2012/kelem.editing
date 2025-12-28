import ApiService from './ApiService'

class UserService extends ApiService {
  constructor() {
    super()
  }

  async getProfile() {
    return this.get('/admin/profile')
  }
  async changePassword(data) {
    return this.patch('/admin/change-password', data)
  }

  async changeProfile(data) {
    const request = {
      url: '/admin/edit-profile/',
      method: 'PATCH',
      data: data
    }
    return this.request(request)
  }
  async changeAccount(data) {
    // return this.path('/admin/profile', data)
    const request = {
      url: '/admin/profile/',
      method: 'PATCH',
      data: data
    }
    return this.request(request)
  }

  async forgotPassword(data) {
    return this.post('/admin/forgot-password', data)
  }

  async resetPassword(token, data) {
    return this.patch('/admin/reset-password/' + token, data)
  }
}
export default new UserService()

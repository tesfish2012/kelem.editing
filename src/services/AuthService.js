import ApiService from './ApiService'

class AuthService extends ApiService {
  constructor() {
    super()
  }
  async logIn(data) {
    return this.post('admin/login', data)
  }
  async UserLogin(data) {
    return this.post('users/login', data)
  }
 
}
export default new AuthService()

import ApiService from './ApiService'

class SettingsService extends ApiService {
  constructor() {
    super()
  }
  // start about us
  async getAboutus() {
    return this.get('/users/aboutus')
  }

  async updateAboutus(id, data) {
    return this.patch('/users/aboutus/' + id, data)
  }
  // end about us
  async getSettings() {
    return this.get('/admin/contact-address')
  }
  async updateSettings(id, data) {
    return this.patch('/admin/contact-address/' + id, data)
  }

  async getHeroData() {
    return this.get('/users/home')
  }
  async createOrUpdateHero(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/users/home/${id}` : '/users/home',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }

  async createOrUpdateLoan(id = '', data) {
    const request = {

      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/loan-calculator/${id}` : '/admin/loan-calculator',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }




  async updateHero(id, data) {
    return this.patch('/users/home/' + id, data)
  }

  async deleteHeroById(id) {
    return this.delete(`/users/home/${id}`)
  }
  // end

  async createService(data) {
    const request = {
      method: 'POST',
      url: '/admin/services',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }
  async getMessageById(id) {
    return this.get(`/users/contact-us/${id}`)
  }

  async updateMessage(id, data) {
    return this.patch(`/users/contact-us/${id}`, data)
  }
  async deleteMessage(id) {
    return this.delete(`/users/contact-us/${id}`)
  }

  async deleteMedia(id) {
    return this.delete(`/admin/social-medias/${id}`)
  }

  async editMedia(id, data) {
    return this.patch(`/admin/social-medias/${id}`, data)
  }
  async addMedia(data) {
    return this.post(`/admin/social-medias`, data)
  }
  async getLinks() {
    return this.get(`/admin/social-medias`)
  }

  async getStatistics() {
    return this.get('/admin/statistics')
  }

  async updateStatistics(id, data) {
    return this.patch('/admin/statistics/' + id, data)
  }
}

export default new SettingsService()

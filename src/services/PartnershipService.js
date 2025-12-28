import ApiService from './ApiService'

class PartnershipService extends ApiService {
  async getAllTrashedPartners() {
    return this.get('/users/partners?trash=true')
  }

  async deleteTrashedPartners(id) {
    return this.delete(`/users/partners/destroy/${id}`)
  }

  async restoreTrashedPartners(id) {
    return this.patch(`/users/partners/backup/${id}`)
  }

  async getAllPartners() {
    return this.get('/users/partners/all')
  }

  async getVerifiedPartners() {
    return this.get('/users/partners')
  }
  async createOrUpdatePartner(data, id = '') {
    if (id) {
      const request = {
        method: 'PATCH',
        url: '/users/partners/' + id,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    } else {
      const request = {
        method: 'POST',
        url: '/users/partners',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    }
  }

  async deletePartner(id) {
    return this.delete(`/users/partners/${id}`)
  }
}

export default new PartnershipService()

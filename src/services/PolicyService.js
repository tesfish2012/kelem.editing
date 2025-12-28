import ApiService from './ApiService'

class PolicyService extends ApiService {
  async getAllPolicies() {
    return this.get('/admin/privacy-policy')
  }

  async createOrUpdatePolicy(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/privacy-policy/${id}` : '/admin/privacy-policy',
      data: data
    }
    return this.request(request)
  }

  async getPolicyByTitle(title) {
    return this.get(`/admin/privacy-policy/${title}`)
  }

  async deletePolicyById(id) {
    return this.delete(`/admin/privacy-policy/${id}`)
  }
}

export default new PolicyService()

import ApiService from './ApiService'

class OrganizationService extends ApiService {
  async getAllOrganization() {
    return this.get('/admin/organizations')
  }

  async createOrUpdateOrganization(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/organizations/${id}` : '/admin/organizations',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }

  async getOrganizationByTitle(title) {
    return this.get(`/admin/organization/${title}`)
  }

  async deleteOrganizationById(id) {
    return this.delete(`/admin/organizations/${id}`)
  }
}

export default new OrganizationService()

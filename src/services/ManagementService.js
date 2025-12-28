import ApiService from './ApiService'

class ManagementService extends ApiService {
  async getAllManagements() {
    return this.get('/admin/professionals')
  }
  
  async deleteManagement(id) {
    return this.delete(`/admin/professionals/${id}`)
  }

  async createOrUpdateManagement(data, id = '') {
    console.log(data);
    if (id) {
      const request = {
        method: 'PATCH',
        url: '/admin/professionals/' + `${id}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    } else {
      const request = {
        method: 'POST',
        url: '/admin/professionals',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    }
  }
}

export default new ManagementService()

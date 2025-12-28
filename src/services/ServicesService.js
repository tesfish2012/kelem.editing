import ApiService from './ApiService'

class ServicesService extends ApiService {

  async getAllTrashedServices() {
    return this.get('/admin/services?trash=true')
  }
  async deleteService(id) {
    return this.delete(`/admin/services/${id}`)
  }
  async deleteTrashedService(id) {
    return this.delete(`/admin/services/destroy/${id}`)
  }
  async restoreTrashedService(id) {
    return this.patch(`/admin/services/backup/${id}`)
  }

  async createOrUpdateService(data, id = '') {
    if (id) {
      const request = {
        method: 'PATCH',
        url: '/admin/services/' + `${id}`,
        data: data
      }
      return this.request(request)
    } else {
      const request = {
        method: 'POST',
        url: '/admin/services/',
        data: data
      }
      return this.request(request)
    }
  }

  async getAllServices() {
    return this.get('/admin/services?trash=false')
  }
  async getServiceByTitle(title) {
    return this.get(`/admin/service/${title}`)
  }

  // subservice  
  async getAllSubServices(serviceId) {
    return this.get(`/admin/services/${serviceId}`)
  }
  async getSubServiceByTitle(title) {
    return this.get(`/admin/sub-services/${title}`)
  }

  async createOrUpdateSubService(serviceId, data, id = '') {
    if (id) {
      const request = {
        method: 'PATCH',
        url: `/admin/sub-Services/${id}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    } else {
      const request = {
        method: 'POST',
        url: `/admin/sub-services/${serviceId}`, // Use serviceId in the URL
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    }
  }

  async deleteSubService(id) {
    return this.delete(`/admin/sub-services/${id}`)
  }
}

export default new ServicesService()
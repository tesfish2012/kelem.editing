// services/GalleryService.js

import ApiService from './ApiService'

class GalleryService extends ApiService {
  async getAllGallery() {
    return this.get('/admin/galleries')
  }

  async createOrUpdateGallery(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/galleries/${id}` : '/admin/galleries',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }

  async getGalleryByTitle(title) {
    return this.get(`/admin/new/${title}`)
  }

  async deleteGalleryById(id) {
    return this.delete(`/admin/galleries/${id}`)
  }
}

export default new GalleryService()

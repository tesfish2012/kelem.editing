import ApiService from './ApiService'

class VideoService extends ApiService {
  async getAllVideos() {
    return this.get('/admin/videos')
  }

  async createOrUpdateVideo(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/videos/${id}` : '/admin/videos',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }

  async getVideoByTitle(title) {
    return this.get(`/admin/video/${title}`)
  }

  async deleteVideoById(id) {
    return this.delete(`/admin/videos/${id}`)
  }
}

export default new VideoService()

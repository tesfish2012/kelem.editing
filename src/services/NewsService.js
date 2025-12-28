import ApiService from './ApiService'

class NewsService extends ApiService {

  async getAllTrashedNews() {
    return this.get('/admin/news?trash=true')
  }
  async deleteTrashedNews(id) {
    return this.delete(`/admin/news/destroy/${id}`)
  }
  async restoreTrashedNews(id) {
    return this.patch(`/admin/news/backup/${id}`)
  }


  async getAllNews() {
    return this.get('/admin/news')
  }
  async requestNew(id = '', data) {
    if (id) {
      
      const request = {
        method: 'PATCH',
        url: '/admin/news/' + id,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    } else {
      const request = {
        method: 'POST',
        url: '/admin/news',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    }
  }
  async getNewByTitle(title) {
    return this.get(`/admin/new/${title}`)
  }
  async deleteNewById(id) {
    return this.delete(`/admin/news/${id}`)
  }
}

export default new NewsService()

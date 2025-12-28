import ApiService from './ApiService'

class StatisticsService extends ApiService {
  async getAllStatistics() {
    return this.get('/admin/statistics')
  }

  async createOrUpdateStatistics(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/statistics/${id}` : '/admin/statistics',
      data: data
    }
    return this.request(request)
  }

  async getStatisticsById(id) {
    return this.get(`/admin/statistics/${id}`)
  }

  async deleteStatisticsById(id) {
    return this.delete(`/admin/statistics/${id}`)
  }
}

export default new StatisticsService()

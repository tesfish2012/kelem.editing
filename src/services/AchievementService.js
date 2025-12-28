import ApiService from './ApiService'

class AchievementService extends ApiService {
  async getAllTrashedAchievement() {
    return this.get('/admin/awards?trash=true')
  }
  async deleteTrashedAchievement(id) {
    return this.delete(`/admin/awards/destroy/${id}`)
  }
  async restoreTrashedAchievement(id) {
    return this.patch(`/admin/awards/backup/${id}`)
  }

  async getAllAchievements() {
    return this.get('/admin/awards')
  }

  async createOrUpdateAchievement(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/awards/${id}` : '/admin/awards',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }

  async getAchievementByTitle(title) {
    return this.get(`/admin/awards/${title}`)
  }

  async deleteAchievementById(id) {
    return this.delete(`/admin/awards/${id}`)
  }
}

export default new AchievementService()

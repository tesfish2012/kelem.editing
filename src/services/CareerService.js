import ApiService from './ApiService'

class CareerService extends ApiService {
  constructor() {
    super()
  }
  //  async getMessages
  async getOpenedCareers() {
    return this.get('/admin/careers')
  }
   async getAllCareers() {
    return this.get('/admin/careers/all')
  }
  async createCareer(data) {
    return this.post('/admin/careers', data)
  }
  async getCareerById(id) {
    return this.get(`/admin/careers/${id}`)
  }
  async updateCareer(data, id) {
    return this.patch('/admin/careers/' + `${id}`, data)
  }
  async deleteCareer(id) {
    return this.delete(`/admin/careers/${id}`)
  }
  async deleteApplicant(id) {
    return this.delete(`/user/applications/${id}`)
  }

  async apply(id, data) {
    const request = {
      method: 'POST',
      url: '/users/applications/' + id,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: data
    }
    return this.request(request)
  }
  async getCareerByTitle(title) {
    return this.get(`/admin/career/${title}`)
  }
  async getJobApplicants(careerId) {
    return this.get(`/users/all-applicants/${careerId}`)
  }
}

export default new CareerService()

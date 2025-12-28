import ApiService from './ApiService'

class FaqsService extends ApiService {
   
  async getFaqs() {
    return this.get('/admin/faqs')
  }
  async createFaq(data) {
    return this.post('/admin/faqs', data)
  }
  async updateFaq(id, data) {
    return this.patch('/admin/faqs/' + id, data)
  }

  async deleteFaq(id) {
    return this.delete(`/admin/faqs/${id}`)
  }
}

export default new FaqsService()

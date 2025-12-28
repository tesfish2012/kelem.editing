
import ApiService from './ApiService'

class LoanService extends ApiService {

  async getAllPolicies() {
    return this.get('/admin/loan-calculator')
  }

  async createOrUpdateLoan(id = '', data) {
    const request = {
      method: id ? 'PATCH' : 'POST',
      url: id ? `/admin/loan-calculator/${id}` : '/admin/loan-calculator',
      data: data
    }
    return this.request(request)
  }

  async getLoanByTitle(title) {
    return this.get(`/admin/loan-calculator/${title}`)
  }

  async deleteLoanById(id) {
    return this.delete(`/admin/loan-calculator/${id}`)
  }
}

export default new LoanService()

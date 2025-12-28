// services/GradeService.js
import ApiService from './ApiService'

class GradeService extends ApiService {
  // Get all grades
  async getAllGrades() {
    return this.get('/admin/grades')
  }

  // Create a new grade
  async createGrade(data) {
    return this.post('/admin/grades', data)
  }

  // Update an existing grade
  async updateGrade(id, data) {
    return this.patch(`/admin/grades/${id}`, data)
  }

  // Get a single grade by ID
  async getGradeById(id) {
    return this.get(`/admin/grades/${id}`)
  }

  // Delete a grade by ID
  async deleteGradeById(id) {
    return this.delete(`/admin/grades/${id}`)
  }
}

export default new GradeService()

// services/admin/studentservice.js
import ApiService from './ApiService'

class StudentService extends ApiService {
  // Login student
  async login(data) {
    // data: { email, password }
    return this.post('/admin/students/login', data)
  }

  // Register student
  async register(data) {
    // data: { name, email, password, gradeId }
    return this.post('/admin/students', data)
  }

  // Get all students
  async getAllStudents() {
    return this.get('/admin/students')
  }

  // Get student by ID
  async getStudentById(id) {
    return this.get(`/admin/students/${id}`)
  }

  // Update student
  async updateStudent(id, data) {
    return this.patch(`/admin/students/${id}`, data)
  }
  // Approve student
async approveStudent(id) {
    return this.patch(`/admin/students/approve/${id}`)
  }   

  // Delete student
  async deleteStudent(id) {
    return this.delete(`/admin/students/${id}`)
  }
}

export default new StudentService()

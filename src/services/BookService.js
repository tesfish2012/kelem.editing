// services/BookService.js
import ApiService from './ApiService'

class BookService extends ApiService {
  // Get all books
  async getAllBooks() {
    return this.get('/admin/books')
  }

  // Create a new book
  async createBook(data) {
    return this.post('/admin/books', data)
  }

  // Update an existing book by ID
  async updateBook(id, data) {
    return this.patch(`/admin/books/${id}`, data)
  }

  // Get a single book by ID
  async getBookById(id) {
    return this.get(`/admin/books/${id}`)
  }

  // Delete a book by ID
  async deleteBookById(id) {
    return this.delete(`/admin/books/${id}`)
  }

  // Get books by grade (optional)
  async getBooksByGrade(gradeId) {
    return this.get(`/admin/books/grade/${gradeId}`)
  }

  // Optional: Get books for users
  async getUserBooks() {
    return this.get('/admin/books')
  }
}

export default new BookService()

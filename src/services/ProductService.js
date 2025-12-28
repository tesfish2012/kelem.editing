import ApiService from './ApiService'

class ProductService extends ApiService {
  async getAllProducts() {
    return this.get('/admin/products')
  }

  async createNew(data, id = '') {
    if (id) {
      const request = {
        method: 'PATCH',
        url: '/admin/products/' + id,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    } else {
      const request = {
        method: 'POST',
        url: '/admin/products',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    }
  }

  async getProductByTitle(title) {
    return this.get(`/admin/products/${title}`)
  }

  async deleteProduct(id) {
    return this.delete(`/admin/products/${id}`)
  }
}

export default new ProductService()

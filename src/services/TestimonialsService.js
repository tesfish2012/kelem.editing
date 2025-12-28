import ApiService from './ApiService'

class TestimonialsService extends ApiService {
  async getAllTrashedTestimonials() {
    return this.get('/admin/testimonials?trash=true')
  }
  async deleteTrashedTestimonials(id) {
    return this.delete(`/admin/testimonials/destroy/${id}`)
  }
  async restoreTrashedTestimonials(id) {
    return this.patch(`/admin/testimonials/backup/${id}`)
  }


   async getAllTestimonials() {
    return this.get('/admin/testimonials')
  }
   async deleteTestimonial(id) {
    return this.delete(`/admin/testimonials/${id}`)
  }
  

   async createOrUpdateTestimonial(data, id = '') {
    if (id) { 
      const request = {
        method: 'PATCH',
        url: '/admin/testimonials/' + `${id}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    } else {
      const request = {
        method: 'POST',
        url: '/admin/testimonials',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data
      }
      return this.request(request)
    }
  }
}

export default new TestimonialsService()

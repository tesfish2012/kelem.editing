import ApiService from './ApiService'

class MessageService extends ApiService {
  constructor() {
    super()
  }
  //  async getMessages
  async getAllMessages() {
    return this.get('/users/contact-us')
  }
  async createMessage(data) {
    return this.post('/users/contact-us', data)
  }
  async getMessageById(id) {
    return this.get(`/users/contact-us/${id}`)
  }
  async updateMessage(id, data) {
    return this.patch(`/users/contact-us/${id}`, data)
  }
  async deleteMessage(id) {
    return this.delete(`/users/contact-us/${id}`)
  }

  async subscribe(data) {
    return this.post('/users/subscribers', data)
  }
  async getSubscribers() {
    return this.get('/users/subscribers')
  }
  async deleteSubscriber(id) {
    return this.delete('/users/subscribers/' + id)
  }
  async editSubscriber(data, id) {
    return this.patch('/users/subscribers/' + id, data)
  }
}

export default new MessageService()

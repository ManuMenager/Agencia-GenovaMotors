import type { ContactMessage, ContactMessageInput } from '../models/contact-message.model.js'
import { contactMessageRepository } from '../repositories/contact-message.repository.js'

export const contactService = {
  submit(data: ContactMessageInput): Promise<ContactMessage> {
    return contactMessageRepository.insert(data)
  },

  list(): Promise<ContactMessage[]> {
    return contactMessageRepository.findAll()
  },
}

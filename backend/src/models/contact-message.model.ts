export interface ContactMessageInput {
  name: string
  email: string
  phone?: string
  message: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  createdAt: string
}

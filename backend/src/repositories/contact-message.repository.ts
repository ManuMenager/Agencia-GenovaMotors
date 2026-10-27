import { pool, type Queryable } from '../database/pool.js'
import type { ContactMessage, ContactMessageInput } from '../models/contact-message.model.js'

interface ContactMessageRow {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: Date
}

const toMessage = (row: ContactMessageRow): ContactMessage => ({
  id: Number(row.id),
  name: row.name,
  email: row.email,
  phone: row.phone,
  message: row.message,
  createdAt: row.created_at.toISOString(),
})

export const contactMessageRepository = {
  async insert(data: ContactMessageInput, db: Queryable = pool): Promise<ContactMessage> {
    const { rows } = await db.query<ContactMessageRow>(
      `INSERT INTO contact_messages (name, email, phone, message) VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, message, created_at`,
      [data.name, data.email, data.phone || null, data.message],
    )
    return toMessage(rows[0])
  },

  async findAll(db: Queryable = pool): Promise<ContactMessage[]> {
    const { rows } = await db.query<ContactMessageRow>(
      'SELECT id, name, email, phone, message, created_at FROM contact_messages ORDER BY created_at DESC, id DESC',
    )
    return rows.map(toMessage)
  },
}

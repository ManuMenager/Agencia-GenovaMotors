import { pool, type Queryable } from '../database/pool.js'
import type { SiteSettings } from '../models/site.model.js'

export const settingsRepository = {
  async find(db: Queryable = pool): Promise<SiteSettings | null> {
    const { rows } = await db.query<Omit<SiteSettings, 'hours'>>(
      'SELECT address, whatsapp, email FROM site_settings WHERE id = 1',
    )
    if (!rows[0]) return null
    const hours = await db.query<{ label: string }>('SELECT label FROM business_hours ORDER BY position')
    return { ...rows[0], hours: hours.rows.map((h) => h.label) }
  },

  async save(settings: SiteSettings, db: Queryable = pool): Promise<void> {
    await db.query(
      `INSERT INTO site_settings (id, address, whatsapp, email) VALUES (1, $1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET address = EXCLUDED.address, whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email`,
      [settings.address, settings.whatsapp, settings.email],
    )
    await db.query('DELETE FROM business_hours')
    await db.query(
      `INSERT INTO business_hours (label, position)
       SELECT h.label, h.position - 1 FROM unnest($1::text[]) WITH ORDINALITY AS h(label, position)`,
      [settings.hours],
    )
  },
}

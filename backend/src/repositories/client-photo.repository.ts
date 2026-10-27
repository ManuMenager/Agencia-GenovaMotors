import { pool, type Queryable } from '../database/pool.js'

export const clientPhotoRepository = {
  async findAll(db: Queryable = pool): Promise<string[]> {
    const { rows } = await db.query<{ url: string }>('SELECT url FROM client_photos ORDER BY position')
    return rows.map((r) => r.url)
  },

  /** Reemplaza la lista completa de fotos, conservando el orden recibido. */
  async replaceAll(urls: string[], db: Queryable = pool): Promise<void> {
    await db.query('DELETE FROM client_photos')
    if (urls.length === 0) return
    await db.query(
      `INSERT INTO client_photos (url, position)
       SELECT u.url, u.position - 1 FROM unnest($1::text[]) WITH ORDINALITY AS u(url, position)`,
      [urls],
    )
  },
}

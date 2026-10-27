import { pool, type Queryable } from '../database/pool.js'

export const imageUsageRepository = {
  /** De las fotos recibidas, las que ya no usa ningún vehículo ni la sección Clientes. */
  async findUnused(urls: string[], db: Queryable = pool): Promise<string[]> {
    if (urls.length === 0) return []
    const { rows } = await db.query<{ url: string }>(
      `SELECT DISTINCT u.url
         FROM unnest($1::text[]) AS u(url)
        WHERE NOT EXISTS (SELECT 1 FROM vehicle_images WHERE url = u.url)
          AND NOT EXISTS (SELECT 1 FROM client_photos WHERE url = u.url)`,
      [urls],
    )
    return rows.map((r) => r.url)
  },
}

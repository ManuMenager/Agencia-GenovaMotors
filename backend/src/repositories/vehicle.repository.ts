import { pool, type Queryable } from '../database/pool.js'
import type { Vehicle, VehicleFilters, VehicleInput } from '../models/vehicle.model.js'

type VehicleRow = Omit<Vehicle, 'price'> & { price: string }

const toVehicle = (row: VehicleRow): Vehicle => ({ ...row, price: Number(row.price) })

// Las fotos se traen ordenadas dentro de la misma consulta, en un arreglo por vehículo.
const SELECT_VEHICLES = `
  SELECT v.id, v.brand, v.model, v.version, v.year, v.price, v.currency, v.condition, v.mileage,
         v.fuel, v.transmission, v.color, v.description, v.featured,
         COALESCE(
           (SELECT array_agg(i.url ORDER BY i.position) FROM vehicle_images i WHERE i.vehicle_id = v.id),
           '{}'
         ) AS images
  FROM vehicles v`

const columns = (id: string, d: VehicleInput) => [
  id, d.brand, d.model, d.version, d.year, d.price, d.currency, d.condition,
  d.mileage, d.fuel, d.transmission, d.color, d.description, d.featured,
]

export const vehicleRepository = {
  async findAll(filters: VehicleFilters = {}, db: Queryable = pool): Promise<Vehicle[]> {
    const where: string[] = []
    const params: unknown[] = []
    if (filters.condition) {
      params.push(filters.condition)
      where.push(`v.condition = $${params.length}`)
    }
    if (filters.featured !== undefined) {
      params.push(filters.featured)
      where.push(`v.featured = $${params.length}`)
    }
    if (filters.search) {
      params.push(`%${filters.search.replace(/[\\%_]/g, '\\$&')}%`)
      where.push(`(v.brand || ' ' || v.model || ' ' || v.version) ILIKE $${params.length}`)
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const { rows } = await db.query<VehicleRow>(`${SELECT_VEHICLES} ${clause} ORDER BY v.seq`, params)
    return rows.map(toVehicle)
  },

  async findById(id: string, db: Queryable = pool): Promise<Vehicle | null> {
    const { rows } = await db.query<VehicleRow>(`${SELECT_VEHICLES} WHERE v.id = $1`, [id])
    return rows[0] ? toVehicle(rows[0]) : null
  },

  async exists(id: string, db: Queryable = pool): Promise<boolean> {
    const { rowCount } = await db.query('SELECT 1 FROM vehicles WHERE id = $1', [id])
    return (rowCount ?? 0) > 0
  },

  async count(db: Queryable = pool): Promise<number> {
    const { rows } = await db.query<{ n: string }>('SELECT count(*) AS n FROM vehicles')
    return Number(rows[0].n)
  },

  async insert(id: string, data: VehicleInput, db: Queryable = pool): Promise<void> {
    await db.query(
      `INSERT INTO vehicles (id, brand, model, version, year, price, currency, condition, mileage, fuel,
                             transmission, color, description, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      columns(id, data),
    )
  },

  /** Devuelve false si no existe el vehículo. */
  async update(id: string, data: VehicleInput, db: Queryable = pool): Promise<boolean> {
    const { rowCount } = await db.query(
      `UPDATE vehicles
          SET brand = $2, model = $3, version = $4, year = $5, price = $6, currency = $7, condition = $8,
              mileage = $9, fuel = $10, transmission = $11, color = $12, description = $13, featured = $14,
              updated_at = now()
        WHERE id = $1`,
      columns(id, data),
    )
    return (rowCount ?? 0) > 0
  },

  /** Reemplaza todas las fotos del vehículo, conservando el orden recibido. */
  async replaceImages(id: string, urls: string[], db: Queryable = pool): Promise<void> {
    await db.query('DELETE FROM vehicle_images WHERE vehicle_id = $1', [id])
    if (urls.length === 0) return
    await db.query(
      `INSERT INTO vehicle_images (vehicle_id, url, position)
       SELECT $1, u.url, u.position - 1 FROM unnest($2::text[]) WITH ORDINALITY AS u(url, position)`,
      [id, urls],
    )
  },

  async delete(id: string, db: Queryable = pool): Promise<boolean> {
    const { rowCount } = await db.query('DELETE FROM vehicles WHERE id = $1', [id])
    return (rowCount ?? 0) > 0
  },
}

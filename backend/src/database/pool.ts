import pg from 'pg'
import { config } from '../config/index.js'

/** Algo contra lo que se pueden correr consultas: el pool o un cliente dentro de una transacción. */
export type Queryable = Pick<pg.Pool, 'query'>

export const pool = new pg.Pool({ connectionString: config.databaseUrl })

pool.on('error', (err) => console.error('[db] Error en una conexión inactiva:', err.message))

/** Corre `fn` en una transacción: si lanza un error se deshace todo, si no se confirma. */
export async function withTransaction<T>(fn: (tx: Queryable) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

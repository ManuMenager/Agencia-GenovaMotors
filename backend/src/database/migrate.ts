import { promises as fs } from 'node:fs'
import path from 'node:path'
import { config } from '../config/index.js'
import { pool, withTransaction } from './pool.js'

/** Aplica, en orden, las migraciones de `migrations/` que todavía no se corrieron. */
export async function migrate(): Promise<string[]> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       name TEXT PRIMARY KEY,
       applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`,
  )
  const { rows } = await pool.query<{ name: string }>('SELECT name FROM schema_migrations')
  const applied = new Set(rows.map((r) => r.name))

  const files = (await fs.readdir(config.migrationsDir)).filter((f) => f.endsWith('.sql')).sort()
  const pending = files.filter((f) => !applied.has(f))

  for (const file of pending) {
    const sql = await fs.readFile(path.join(config.migrationsDir, file), 'utf8')
    await withTransaction(async (tx) => {
      await tx.query(sql)
      await tx.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file])
    })
    console.log(`[db] Migración aplicada: ${file}`)
  }
  return pending
}

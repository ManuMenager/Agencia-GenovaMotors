import { migrate } from './migrate.js'
import { pool } from './pool.js'
import { seed } from './seed.js'

const commands = {
  migrate: async () => {
    const applied = await migrate()
    if (applied.length === 0) console.log('[db] No hay migraciones pendientes.')
  },
  seed: async () => {
    console.log((await seed()) ? '[db] Datos iniciales cargados.' : '[db] La base ya tiene datos: no se cargó nada.')
  },
  setup: async () => {
    await commands.migrate()
    await commands.seed()
  },
} as const

const name = process.argv[2] as keyof typeof commands
try {
  if (!(name in commands)) throw new Error(`Comando desconocido. Usá: ${Object.keys(commands).join(' | ')}`)
  await commands[name]()
} catch (err) {
  console.error('[db]', err instanceof Error ? err.message : err)
  process.exitCode = 1
} finally {
  await pool.end()
}

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { config } from './config.js'
import { seed } from './data/seed.js'
import type { Db } from './types/site.js'

const DB_FILE = path.join(config.dataDir, 'db.json')

let cache: Db | null = null
// Cola de escrituras: las modificaciones se aplican de a una para no pisarse.
let queue: Promise<unknown> = Promise.resolve()

async function load(): Promise<Db> {
  if (cache) return cache
  try {
    cache = JSON.parse(await fs.readFile(DB_FILE, 'utf8')) as Db
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
    cache = structuredClone(seed)
    await persist(cache)
  }
  return cache
}

/** Escribe en un archivo temporal y lo renombra, para no dejar el JSON a medias si algo falla. */
async function persist(db: Db): Promise<void> {
  await fs.mkdir(config.dataDir, { recursive: true })
  const tmp = `${DB_FILE}.tmp`
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8')
  await fs.rename(tmp, DB_FILE)
}

export async function readDb(): Promise<Db> {
  return load()
}

/** Aplica un cambio sobre la base y la guarda. Si `fn` lanza un error, no se guarda nada. */
export function mutateDb<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load()
    const draft = structuredClone(db)
    const result = await fn(draft)
    await persist(draft)
    cache = draft
    return result
  })
  queue = run.catch(() => undefined)
  return run
}

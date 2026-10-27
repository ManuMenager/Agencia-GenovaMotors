import { app } from './app.js'
import { config } from './config/index.js'
import { pool } from './database/pool.js'

try {
  await pool.query('SELECT 1')
} catch (err) {
  console.error(`No se pudo conectar a PostgreSQL: ${(err as Error).message}`)
  process.exit(1)
}

const server = app.listen(config.port, (err?: Error) => {
  if (err) {
    console.error(`No se pudo iniciar en el puerto ${config.port}: ${err.message}`)
    process.exit(1)
  }
  console.log(`API escuchando en http://localhost:${config.port}`)
})

// Cierre ordenado: deja de aceptar pedidos y libera las conexiones a la base.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => void pool.end().then(() => process.exit(0)))
  })
}

import { app } from './app.js'
import { config } from './config.js'

app.listen(config.port, (err?: Error) => {
  if (err) {
    console.error(`No se pudo iniciar en el puerto ${config.port}: ${err.message}`)
    process.exit(1)
  }
  console.log(`API escuchando en http://localhost:${config.port}`)
})

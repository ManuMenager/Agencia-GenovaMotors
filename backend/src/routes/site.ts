import { Router } from 'express'
import { imageSizes } from '../imageSizes.js'
import { readDb } from '../store.js'

export const siteRouter = Router()

/** Todo lo que necesita el sitio público para mostrarse, en un solo pedido. */
siteRouter.get('/site', async (_req, res) => {
  const { vehicles, clients, settings } = await readDb()
  // Tamaño de las fotos de clientes: el frontend reserva su lugar y la página no se reacomoda al cargarlas.
  res.json({ vehicles, clients, settings, clientSizes: await imageSizes(clients) })
})

siteRouter.get('/clients', async (_req, res) => {
  res.json((await readDb()).clients)
})

siteRouter.get('/settings', async (_req, res) => {
  res.json((await readDb()).settings)
})

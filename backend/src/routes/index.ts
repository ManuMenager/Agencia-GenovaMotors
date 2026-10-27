import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { contactController } from '../controllers/contact.controller.js'
import { siteController } from '../controllers/site.controller.js'
import { uploadController } from '../controllers/upload.controller.js'
import { vehicleController } from '../controllers/vehicle.controller.js'
import { requireAdmin } from '../middlewares/auth.middleware.js'
import { imageUpload } from '../middlewares/upload.middleware.js'

export const apiRouter = Router()

// ---------- Público ----------

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})
apiRouter.get('/site', siteController.snapshot)
apiRouter.get('/clients', siteController.clients)
apiRouter.get('/settings', siteController.settings)
apiRouter.get('/vehicles', vehicleController.list)
apiRouter.get('/vehicles/:id', vehicleController.get)
apiRouter.post('/contact', contactController.submit)

// ---------- Administración ----------

const admin = Router()
apiRouter.use('/admin', admin)

admin.post('/login', authController.login)
admin.post('/logout', authController.logout)
admin.get('/me', authController.me)

// Todo lo que sigue exige sesión de administrador.
admin.use(requireAdmin)

admin.post('/vehicles', vehicleController.create)
admin.put('/vehicles/:id', vehicleController.update)
admin.delete('/vehicles/:id', vehicleController.remove)
admin.put('/clients', siteController.saveClients)
admin.put('/settings', siteController.saveSettings)
admin.post('/uploads', imageUpload.array('files', 12), uploadController.upload)
admin.get('/contact-messages', contactController.list)

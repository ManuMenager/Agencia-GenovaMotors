import { withTransaction } from '../database/pool.js'
import { AppError } from '../errors/app-error.js'
import type { SiteSettings } from '../models/site.model.js'
import { settingsRepository } from '../repositories/settings.repository.js'

export const settingsService = {
  async get(): Promise<SiteSettings> {
    const settings = await settingsRepository.find()
    if (!settings) throw new AppError(500, 'Faltan los datos del sitio. Corré "npm run db:seed".')
    return settings
  },

  async update(settings: SiteSettings): Promise<SiteSettings> {
    await withTransaction((tx) => settingsRepository.save(settings, tx))
    return settings
  },
}

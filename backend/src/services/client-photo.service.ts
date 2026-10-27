import { withTransaction } from '../database/pool.js'
import { clientPhotoRepository } from '../repositories/client-photo.repository.js'
import { removeUnusedImages } from './image-cleanup.service.js'

export const clientPhotoService = {
  list(): Promise<string[]> {
    return clientPhotoRepository.findAll()
  },

  async replace(photos: string[]): Promise<string[]> {
    const previous = await withTransaction(async (tx) => {
      const before = await clientPhotoRepository.findAll(tx)
      await clientPhotoRepository.replaceAll(photos, tx)
      return before
    })
    await removeUnusedImages(previous)
    return photos
  },
}

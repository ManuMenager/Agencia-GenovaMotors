import { imageUsageRepository } from '../repositories/image-usage.repository.js'
import { removeUploads } from './upload.service.js'

/** Borra del disco las fotos subidas que ya no usa ningún vehículo ni la sección Clientes. */
export async function removeUnusedImages(candidates: string[]): Promise<void> {
  const unused = await imageUsageRepository.findUnused([...new Set(candidates)])
  await removeUploads(unused)
}

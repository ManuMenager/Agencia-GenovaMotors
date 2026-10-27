import type { SiteSettings } from '../models/site.model.js'
import type { VehicleInput } from '../models/vehicle.model.js'
import { vehicles } from './seed-vehicles.js'

export interface SeedData {
  vehicles: (VehicleInput & { id: string })[]
  clients: string[]
  settings: SiteSettings
}

// Datos iniciales: se cargan con `npm run db:seed` cuando la base está vacía.
export const seedData: SeedData = {
  vehicles: vehicles.map((v) => ({ ...v, featured: v.featured ?? false, description: v.description ?? '' })),
  clients: [
    '/images/clients/489953327_18219934762290215_6654863131042304994_n.jpg',
    '/images/clients/cliente-02.jpg',
    '/images/clients/cliente-03.jpg',
    '/images/clients/cliente-04.jpg',
    '/images/clients/cliente-05.jpg',
    '/images/clients/cliente-06.jpg',
    '/images/clients/cliente-07.jpg',
  ],
  settings: {
    address: 'Zapiola 262, Bernal',
    whatsapp: '5491100000000',
    email: 'ventas@genovamotors.com',
    hours: ['Lunes a viernes: 9 a 19 hs', 'Sábados: 9 a 13 hs'],
  },
}

# Génova Motors — Frontend

Sitio web de la agencia de autos y panel de administración del dueño. React + TypeScript + Vite + Tailwind CSS + React Router.

## Comenzar

El frontend necesita el backend corriendo (ver `../backend/README.md`): toda la información se carga desde la API.

```bash
npm install
npm run dev
```

- Sitio: http://localhost:5173
- Panel del dueño: http://localhost:5173/admin (contraseña definida en `backend/.env`)

En desarrollo, Vite redirige `/api` y `/uploads` al backend (`localhost:3001`). Si el backend está en otro dominio, copiar `.env.example` a `.env` y completar `VITE_API_URL`.

## Scripts

| Comando           | Descripción                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Servidor de desarrollo          |
| `npm run build`   | Typecheck + build de producción |
| `npm run preview` | Previsualizar el build          |
| `npm run lint`    | ESLint                          |
| `npm run format`  | Prettier                        |

## Estructura

```
src/
  components/   layout/ (Header, Footer, Layout), ui/ (Button, Logo, SectionTitle), home/, vehicles/ (Card, Grid, Galería, Filtros)
  pages/        Home, Vehículos, Detalle, Clientes, Contacto, 404
  admin/        Panel del dueño: login, layout, vehículos (lista y formulario), clientes, datos del sitio, gestor de fotos
  context/      SiteDataContext: vehículos, fotos de clientes y datos de contacto cargados desde la API
  hooks/        useVehicleFilters, useContact
  lib/          api.ts (cliente de la API), format.ts, contact.ts
  routes/       router.tsx
  types/        vehicle.ts, site.ts
```

El alias `@/` apunta a `src/`.

## Panel del dueño

Está en `/admin`, no aparece en el menú del sitio y lleva `noindex`. Sin sesión redirige al login. Desde ahí se pueden:

- cargar, editar y eliminar vehículos (con sus fotos),
- subir, reordenar y quitar las fotos de la sección Clientes,
- modificar dirección, WhatsApp, email y horarios.

Lo que cargue el dueño se guarda en el backend y se refleja de inmediato en el sitio.

## Próximos pasos sugeridos

- Conectar el formulario de contacto para guardar las consultas y verlas en el panel.
- Reemplazar las fotos de ejemplo (vehículos y "Clientes") por las reales desde el panel.

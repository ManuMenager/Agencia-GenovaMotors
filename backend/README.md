# Génova Motors — API

Node.js + Express 5 + TypeScript.

```bash
npm install
cp .env.example .env     # completar ADMIN_PASSWORD y SESSION_SECRET
npm run dev
```

## Configuración (`.env`)

| Variable         | Descripción                                                                    |
| ---------------- | ------------------------------------------------------------------------------ |
| `ADMIN_PASSWORD` | Contraseña del dueño. Sin ella el acceso al panel queda deshabilitado.         |
| `SESSION_SECRET` | Clave para firmar las sesiones. Si falta, se genera una al azar en cada inicio. |
| `PORT`           | Puerto (por defecto 3001).                                                     |
| `CORS_ORIGIN`    | Origen del frontend permitido (por defecto `http://localhost:5173`).           |

## Endpoints

Públicos:

| Método | Ruta                | Descripción                                                 |
| ------ | ------------------- | ----------------------------------------------------------- |
| GET    | `/api/health`       | Estado del servidor                                         |
| GET    | `/api/vehicles`     | Lista (query: `condition`, `featured`, `search`)            |
| GET    | `/api/vehicles/:id` | Detalle de un vehículo                                      |
| GET    | `/api/site`         | Vehículos, fotos de clientes, datos del sitio y `clientSizes` (ancho y alto de cada foto de cliente, para que el frontend reserve su lugar) en un solo pedido |
| GET    | `/api/clients`      | Fotos de la sección Clientes                                |
| GET    | `/api/settings`     | Dirección, WhatsApp, email y horarios                       |
| POST   | `/api/contact`      | Consulta de contacto (`name`, `email`, `phone?`, `message`) |

Administración (`/api/admin/*`). Todo lo que sigue a `login`, `logout` y `me` exige la sesión del dueño (cookie `HttpOnly`); sin ella responde `401`.

| Método | Ruta                      | Descripción                                         |
| ------ | ------------------------- | --------------------------------------------------- |
| POST   | `/api/admin/login`        | `{ "password": "…" }`. Máx. 5 intentos fallidos cada 15 min por IP |
| POST   | `/api/admin/logout`       | Cierra la sesión                                    |
| GET    | `/api/admin/me`           | `{ "admin": true \| false }`                        |
| POST   | `/api/admin/vehicles`     | Crea un vehículo (el `id` se genera a partir de marca, modelo y año) |
| PUT    | `/api/admin/vehicles/:id` | Edita un vehículo                                   |
| DELETE | `/api/admin/vehicles/:id` | Elimina un vehículo y sus fotos subidas             |
| PUT    | `/api/admin/clients`      | `{ "photos": [...] }` — fotos de clientes, en orden |
| PUT    | `/api/admin/settings`     | `{ address, whatsapp, email, hours[] }`             |
| POST   | `/api/admin/uploads`      | `multipart`, campo `files` (hasta 12 imágenes JPG/PNG/WebP de 12 MB). Devuelve `{ urls }` |

## Fotos livianas

Cada foto `foto.jpg` tiene cuatro versiones WebP al lado, y el sitio elige la más chica que se ve bien en cada lugar: `foto-240.webp` (miniaturas: lista del panel y galería de la ficha), `foto-400.webp` (tarjetas en celular), `foto-640.webp` (tarjetas en pantallas grandes) y `foto-1280.webp` (foto grande de la ficha). Cada una tiene un peso máximo (12, 30, 60 y 140 KB): si una foto con mucho detalle lo supera, se baja la calidad de a poco hasta cumplirlo. Las que sube el dueño las genera `src/uploads.ts` al subirlas (y las borra junto con la original). Las fotos estáticas del frontend (`frontend/public/images`) se generan con:

```bash
npm run variants
```

Hay que correrlo cuando se agreguen fotos nuevas a esa carpeta. El hero del inicio usa `hero-800.webp` y `hero-1600.webp`, y el logo tiene tres tamaños (`logo-header-256.webp`, `-384.webp` y `logo-header.webp`).

## Datos y archivos

- `data/db.json`: vehículos, fotos de clientes y datos del sitio. Se crea solo la primera vez a partir de `src/data/seed.ts` y `src/data/vehicles.ts`. Para volver al estado inicial, borrarlo.
- `uploads/`: fotos subidas desde el panel (optimizadas a JPEG de hasta 1600 px). Se sirven en `/uploads/…`.
- Ninguno de los dos se versiona (están en `.gitignore`). Hay que respaldarlos si el sitio se publica.
- `src/store.ts` encapsula el acceso a los datos (escritura atómica y en cola), de modo que cambiar el JSON por una base de datos solo toca ese archivo.

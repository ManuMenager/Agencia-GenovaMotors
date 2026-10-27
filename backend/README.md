# Génova Motors — API

Node.js + Express 5 + TypeScript + PostgreSQL.

```bash
createdb -U postgres genova_motors   # una sola vez
npm install
cp .env.example .env     # completar DATABASE_URL, ADMIN_PASSWORD y SESSION_SECRET
npm run db:setup         # migraciones + datos iniciales
npm run dev
```

## Arquitectura en capas

```
route → middleware → controller → service → repository → PostgreSQL
```

| Capa           | Carpeta         | Responsabilidad                                                                                  |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| Rutas          | `routes/`       | Asocia cada método y URL con un controller y los middlewares que necesita.                       |
| Middlewares    | `middlewares/`  | Sesión de administrador, recepción de archivos y manejo de errores (los traduce a HTTP).         |
| Controllers    | `controllers/`  | Capa HTTP: leen el pedido, lo validan con los `validators/`, llaman al service y arman la respuesta. |
| Validators     | `validators/`   | Esquemas Zod de lo que entra al servidor.                                                        |
| Services       | `services/`     | Lógica de negocio: ids, reglas, transacciones, sesión, fotos. No conocen Express ni escriben SQL. |
| Repositories   | `repositories/` | Único lugar con SQL. Consultas parametrizadas; devuelven objetos del modelo.                     |
| Models         | `models/`       | Entidades y DTOs (`Vehicle`, `SiteSettings`, `ContactMessage`).                                  |
| Base de datos  | `database/`     | Pool de conexiones, transacciones (`withTransaction`), migraciones y carga inicial.              |

Los errores esperados se lanzan como `AppError` (`errors/`) y el middleware de errores los convierte en la respuesta; los errores de validación de Zod responden `400`.

## Base de datos

Esquema en `migrations/*.sql` (se aplican en orden y se registran en `schema_migrations`):

| Tabla              | Contenido                                                      |
| ------------------ | -------------------------------------------------------------- |
| `vehicles`         | Datos del vehículo, con restricciones `CHECK` en los campos fijos |
| `vehicle_images`   | Fotos de cada vehículo (`position` 0 = principal), con borrado en cascada |
| `client_photos`    | Fotos de la sección Clientes, en orden                         |
| `site_settings`    | Dirección, WhatsApp y email (una sola fila)                    |
| `business_hours`   | Horarios, en orden                                             |
| `contact_messages` | Consultas del formulario de contacto                           |

| Comando              | Qué hace                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `npm run db:migrate` | Aplica las migraciones pendientes                                                         |
| `npm run db:seed`    | Carga datos iniciales si no hay vehículos (importa `data/db.json` si existe, si no, los de ejemplo) |
| `npm run db:setup`   | Las dos anteriores                                                                        |

Para cambiar el esquema, agregar una migración nueva (`002_….sql`); no editar las ya aplicadas.

## Configuración (`.env`)

| Variable         | Descripción                                                                    |
| ---------------- | ------------------------------------------------------------------------------ |
| `DATABASE_URL`   | Conexión a PostgreSQL. Obligatoria.                                            |
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
| POST   | `/api/contact`      | Consulta de contacto (`name`, `email`, `phone?`, `message`); se guarda en la base |

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
| GET    | `/api/admin/contact-messages` | Consultas recibidas, de la más nueva a la más vieja |

## Fotos livianas

Cada foto `foto.jpg` tiene cuatro versiones WebP al lado, y el sitio elige la más chica que se ve bien en cada lugar: `foto-240.webp` (miniaturas: lista del panel y galería de la ficha), `foto-400.webp` (tarjetas en celular), `foto-640.webp` (tarjetas en pantallas grandes) y `foto-1280.webp` (foto grande de la ficha). Cada una tiene un peso máximo (12, 30, 60 y 140 KB): si una foto con mucho detalle lo supera, se baja la calidad de a poco hasta cumplirlo. Las que sube el dueño las genera `src/uploads.ts` al subirlas (y las borra junto con la original). Las fotos estáticas del frontend (`frontend/public/images`) se generan con:

```bash
npm run variants
```

Hay que correrlo cuando se agreguen fotos nuevas a esa carpeta. El hero del inicio usa `hero-800.webp` y `hero-1600.webp`, y el logo tiene tres tamaños (`logo-header-256.webp`, `-384.webp` y `logo-header.webp`).

## Datos y archivos

- Los datos viven en PostgreSQL (respaldar con `pg_dump`). Los datos de ejemplo están en `src/database/seed-data.ts` y `seed-vehicles.ts`.
- `uploads/`: fotos subidas desde el panel (optimizadas a JPEG de hasta 1600 px). Se sirven en `/uploads/…`. No se versiona (está en `.gitignore`); hay que respaldarla junto con la base. En la base solo se guarda la ruta de cada foto.
- `data/db.json` es del almacenamiento anterior: solo lo lee `npm run db:seed` para importarlo; después ya no se usa.

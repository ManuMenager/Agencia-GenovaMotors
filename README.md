# Génova Motors

**Sitio web y panel de administración para una agencia de autos.** Catálogo con filtros avanzados, fichas con galería, contacto directo por WhatsApp y un panel privado para que el dueño cargue y edite todo el contenido sin tocar código.

![React](https://img.shields.io/badge/React_19-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06b6d4?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node.js_·_Express_5-339933?logo=nodedotjs&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100%2F100%2F100-0cce6b?logo=lighthouse&logoColor=white)

<!--
  ANTES DE PUBLICAR EL README:
  1. Agregar capturas o un GIF corto (inicio, catálogo con filtros, ficha, panel) en docs/ y enlazarlos acá.
  2. Cuando haya demo publicada, poner el link abajo.
-->
> 🔗 **Demo:** _(pendiente de publicar)_ &nbsp;·&nbsp; 📸 **Capturas:** _(pendiente)_

## En una frase

Un proyecto full stack hecho de punta a punta: diseño responsive, API REST propia con autenticación, subida y optimización de imágenes, y un trabajo cuidadoso de rendimiento y accesibilidad. **Lighthouse da 100 en rendimiento, accesibilidad, buenas prácticas y SEO en todo el sitio público** (inicio, catálogo, ficha del vehículo, clientes y contacto), medido sobre el build de producción.

## Qué demuestra este proyecto

| Área | Qué se hizo |
| --- | --- |
| **Frontend** | SPA en React 19 + TypeScript estricto, React Router con carga bajo demanda, estado compartido con Context, hooks propios, Tailwind v4 y un sistema de diseño propio (paleta oscura/dorada basada en el logo). |
| **Backend** | API REST con Express 5 + TypeScript, validación con Zod, persistencia con escritura atómica, subida de archivos con Multer y procesamiento con Sharp. |
| **Seguridad** | Login con comparación en tiempo constante, sesión en cookie `HttpOnly` + `SameSite=Strict` firmada con HMAC, límite de intentos de login, Helmet, validación de todo lo que entra al servidor y rutas de escritura protegidas. |
| **Rendimiento** | LCP 0,5 s, CLS 0, TBT 0 ms. Imágenes WebP en 4 tamaños con `srcset`, precarga de la imagen principal y de los datos, y code splitting. La primera pantalla del catálogo en celular pesa ~75 KB de imágenes. En Clientes, el servidor informa el tamaño de cada foto para reservar su lugar y las columnas no se reacomodan al cargar. |
| **Accesibilidad y SEO** | Contraste AA, nombres accesibles en todos los controles, `robots.txt`, metadatos y `noindex` en el panel. |
| **Responsive** | Pensado para celular primero: 2 vehículos por fila, filtros desplegables, barra fija de contacto en la ficha. Revisado sin desbordes desde 320 px. |
| **Producto** | Pensado para un usuario real (el dueño, que no es programador): todo lo que ve el cliente se administra desde el panel. |

## Funcionalidades

**Sitio público**
- **Inicio** con propuesta de valor, servicios y vehículos destacados.
- **Catálogo** con filtros por texto, marca, condición (nuevo / usado), transmisión y rangos de precio, año y kilometraje (mín–máx); orden por precio, año o kilometraje, ascendente o descendente.
- **Ficha del vehículo** con galería (flechas y miniaturas), datos técnicos y consulta por WhatsApp con el mensaje prellenado.
- **Clientes**: galería en columnas de fotos de clientes con su auto.
- **Contacto** con WhatsApp, email, dirección con enlace a Google Maps, horarios y formulario validado.

**Panel del dueño** (`/admin`, con contraseña)
- **Vehículos:** alta, edición y baja con buscador; destacar en el inicio; subir varias fotos, reordenarlas, elegir la principal y quitarlas.
- **Clientes:** subir, reordenar y quitar fotos.
- **Datos del sitio:** dirección, WhatsApp, email y horarios, que se actualizan al instante en el pie de página, en Contacto y en todos los botones de WhatsApp.

## Arquitectura

```
┌──────────────────────────┐   /api, /uploads   ┌──────────────────────────────┐
│  Frontend (React + Vite) │ ─────────────────▶ │  Backend (Express 5 + TS)    │
│  Sitio público + /admin  │ ◀───────────────── │  API REST · sesión · fotos   │
└──────────────────────────┘        JSON        └──────────────┬───────────────┘
                                                               │
                                              data/db.json (datos) · uploads/ (fotos)
```

- **Dos proyectos independientes** (`frontend/` y `backend/`), cada uno con su `package.json`, build y despliegue.
- El sitio público pide todo lo que necesita en **una sola llamada** (`GET /api/site`) y la comparte con un contexto de React; cuando el dueño guarda algo en el panel, el sitio lo refleja de inmediato.

```
frontend/src/
  components/   layout, ui (Button, Photo, Logo, DataGate…), vehicles (Card, Grid, Galería, Filtros), home
  pages/        Inicio, Vehículos, Ficha, Clientes, Contacto, 404
  admin/        login, layout del panel, vehículos (lista y formulario), clientes, datos del sitio, gestor de fotos
  context/ hooks/ lib/ routes/ types/
backend/src/
  routes/       públicas (vehicles, site, contact) y de administración (admin)
  auth.ts       sesión del dueño y límite de intentos
  store.ts      persistencia en JSON, atómica y en cola
  schemas.ts    validación (Zod) de todo lo que entra
  uploads.ts · webp.ts   subida y optimización de fotos
```

## Decisiones técnicas

- **Persistencia en un archivo JSON, encapsulada en `store.ts`.** Para el volumen de una agencia alcanza y evita instalar una base de datos. Las escrituras se encolan y son atómicas (archivo temporal + renombrado). Migrar a una base real solo toca ese archivo.
- **Autenticación mínima pero correcta para un único dueño.** En lugar de sumar una librería de usuarios, una contraseña en variable de entorno, comparada por hash con `timingSafeEqual`, y una cookie firmada con vencimiento. Es poca superficie de ataque y fácil de auditar.
- **Todo se valida en el servidor**, no solo en los formularios. Las rutas de imágenes se restringen a `/images/…` y `/uploads/…`, y Sharp rechaza archivos que no sean imágenes reales.
- **Imágenes optimizadas al subir y al compilar.** Cada foto tiene versiones WebP de 240, 400, 640 y 1280 px con un tope de peso (la calidad baja de a poco si una foto es muy detallada); el navegador elige la adecuada con `srcset`. Al quitar una foto o borrar un vehículo se eliminan del disco las que quedan sin uso.
- **El inicio no espera a la API.** El hero es una imagen real con `fetchpriority="high"` y precarga; los datos se precargan desde el HTML en paralelo con el JavaScript; y mientras llegan, las páginas ocupan al menos una pantalla para que el pie de página no salte (CLS 0).
- **Code splitting.** El código del panel y las páginas menos visitadas se cargan bajo demanda, así que los visitantes no descargan el panel.
- **Proxy de desarrollo.** Vite redirige `/api` y `/uploads` al backend: todo corre en el mismo origen y las cookies de sesión funcionan sin configurar CORS.

## Cómo correrlo

Requisitos: Node.js 20 o superior.

```bash
# Terminal 1: API
cd backend
npm install
cp .env.example .env      # completar ADMIN_PASSWORD y SESSION_SECRET
npm run dev
```

```bash
# Terminal 2: sitio
cd frontend
npm install
npm run dev
```

- Sitio: http://localhost:5173 · Panel del dueño: http://localhost:5173/admin · API: http://localhost:3001/api/health
- El sitio necesita el backend corriendo. Si no está, muestra un mensaje con un botón para reintentar.
- Para generar una clave de sesión: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- Al iniciar por primera vez, el backend crea `backend/data/db.json` con **30 vehículos de ejemplo**. Para volver al estado inicial, borrar ese archivo y `backend/uploads/`.

**Para medir con Lighthouse** hay que usar el build de producción, no el servidor de desarrollo: `npm run perf` en `frontend/` (compila y sirve en http://localhost:4173, con el backend corriendo). Conviene una ventana de incógnito: las extensiones del navegador inyectan scripts que Lighthouse cuenta como propios.

| Variable (backend) | Descripción |
| --- | --- |
| `ADMIN_PASSWORD` | Contraseña del dueño. Sin ella el panel queda deshabilitado. |
| `SESSION_SECRET` | Clave para firmar las sesiones. Si falta, las sesiones se pierden al reiniciar. |
| `PORT` · `CORS_ORIGIN` | Puerto de la API (3001) y origen del frontend permitido (`http://localhost:5173`). |

| Proyecto | Scripts |
| --- | --- |
| frontend | `dev`, `build`, `preview`, `perf`, `lint`, `format` |
| backend | `dev`, `build`, `start`, `typecheck`, `variants` (genera las versiones WebP de las fotos estáticas) |

## API

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/site` | Público | Vehículos, fotos de clientes y datos del sitio en un solo pedido |
| GET | `/api/vehicles` · `/api/vehicles/:id` | Público | Lista (query: `condition`, `featured`, `search`) y detalle |
| GET | `/api/clients` · `/api/settings` | Público | Fotos de clientes · dirección, WhatsApp, email y horarios |
| POST | `/api/contact` | Público | Consulta de contacto |
| POST/GET | `/api/admin/login` · `logout` · `me` | Público | Sesión del dueño |
| POST/PUT/DELETE | `/api/admin/vehicles[/:id]` | Dueño | Alta, edición y baja de vehículos |
| PUT | `/api/admin/clients` · `/api/admin/settings` | Dueño | Fotos de clientes · datos del sitio |
| POST | `/api/admin/uploads` | Dueño | Sube fotos (`multipart`, hasta 12) |

Más detalle en [`backend/README.md`](backend/README.md) y [`frontend/README.md`](frontend/README.md).

## Limitaciones conocidas y próximos pasos

Soy consciente de lo que falta, y lo dejo por escrito:

- [ ] **Tests.** Hoy no hay tests automatizados; la verificación fue manual y con Lighthouse. Lo siguiente sería tests de la API (validación, autenticación y subida) y de componentes.
- [ ] **Base de datos.** El archivo JSON es suficiente para este caso, pero no escala a varios servidores ni a muchos escritores.
- [ ] **Consultas del formulario de contacto.** Se validan pero no se guardan ni se envían por email; el siguiente paso sería guardarlas y mostrarlas en el panel.
- [ ] **Despliegue.** Con frontend y backend en dominios distintos hay que ajustar la cookie de sesión (`SameSite`) o publicarlos bajo el mismo dominio.
- [ ] **Renderizado en el servidor.** Es una SPA; para SEO de fichas individuales convendría prerender o SSR.

## Créditos y datos de ejemplo

Los vehículos, textos y datos de contacto son **ficticios**. Las fotos son de [Unsplash](https://unsplash.com) (Unsplash License), de fotógrafos como Jiawei Zhao (hero), 4wheelhouse, Bestami Sarıkaya, Neerob Raihan y Ansis Kančs, y son imágenes de prueba, no de unidades reales. En "Clientes", la primera foto es de la agencia y el resto son de prueba; deben reemplazarse por fotos reales desde el panel.

## Autor

<!-- Reemplazar por tus datos reales. -->
**[Tu nombre]** · [LinkedIn](https://www.linkedin.com/in/tu-usuario) · [GitHub](https://github.com/ManuMenager) · [tu@email.com](mailto:tu@email.com)

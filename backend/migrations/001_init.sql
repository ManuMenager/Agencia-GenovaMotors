-- Esquema inicial de Génova Motors.

CREATE TABLE vehicles (
  id            TEXT PRIMARY KEY,
  seq           BIGSERIAL NOT NULL UNIQUE, -- orden de carga: las altas nuevas van al final
  brand         TEXT NOT NULL,
  model         TEXT NOT NULL,
  version       TEXT NOT NULL,
  year          INTEGER NOT NULL CHECK (year BETWEEN 1950 AND 2100),
  price         NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
  currency      TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'ARS')),
  condition     TEXT NOT NULL CHECK (condition IN ('nuevo', 'usado')),
  mileage       INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  fuel          TEXT NOT NULL CHECK (fuel IN ('nafta', 'diesel', 'hibrido', 'electrico', 'gnc')),
  transmission  TEXT NOT NULL CHECK (transmission IN ('manual', 'automatica')),
  color         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX vehicles_condition_idx ON vehicles (condition);
CREATE INDEX vehicles_featured_idx ON vehicles (featured) WHERE featured;

-- Fotos de cada vehículo; `position` 0 es la principal.
CREATE TABLE vehicle_images (
  id          BIGSERIAL PRIMARY KEY,
  vehicle_id  TEXT NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  position    INTEGER NOT NULL,
  UNIQUE (vehicle_id, position)
);

-- Fotos de la sección Clientes.
CREATE TABLE client_photos (
  id        BIGSERIAL PRIMARY KEY,
  url       TEXT NOT NULL,
  position  INTEGER NOT NULL UNIQUE
);

-- Datos del sitio: una sola fila (id = 1).
CREATE TABLE site_settings (
  id        SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  address   TEXT NOT NULL,
  whatsapp  TEXT NOT NULL,
  email     TEXT NOT NULL
);

CREATE TABLE business_hours (
  id        BIGSERIAL PRIMARY KEY,
  label     TEXT NOT NULL,
  position  INTEGER NOT NULL UNIQUE
);

-- Consultas enviadas desde el formulario de contacto.
CREATE TABLE contact_messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

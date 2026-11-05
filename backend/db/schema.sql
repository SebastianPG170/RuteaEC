-- Esquema del core: Region -> City -> Experience (+ Category) y administradores
CREATE TABLE IF NOT EXISTS regions (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cities (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(60) NOT NULL,
  region_id INTEGER NOT NULL REFERENCES regions(id),
  UNIQUE (region_id, name)
);

CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS experiences (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(80) NOT NULL,
  description      VARCHAR(300) NOT NULL DEFAULT '',
  city_id          INTEGER NOT NULL REFERENCES cities(id),
  category_id      INTEGER NOT NULL REFERENCES categories(id),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 15 AND 720),
  price            NUMERIC(8,2) NOT NULL CHECK (price > 0 AND price <= 1000),
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (city_id, name)
);

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL
);

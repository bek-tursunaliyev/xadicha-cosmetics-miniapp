-- Xadicha Cosmetics — Telegram Mini App production schema (PostgreSQL / Neon)

CREATE TABLE IF NOT EXISTS users (
  id              BIGSERIAL PRIMARY KEY,
  telegram_id     BIGINT UNIQUE NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  username        TEXT,
  phone           TEXT,
  address         TEXT,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  image_url       TEXT,
  price           NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  delivery_price  NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_price >= 0),
  stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  keywords        TEXT NOT NULL DEFAULT '', -- space-separated search tags, e.g. "krem yuz quruq-teri namlantiruvchi"
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_search
  ON products USING gin (to_tsvector('simple', name || ' ' || coalesce(keywords, '')));

CREATE TABLE IF NOT EXISTS stories (
  id              BIGSERIAL PRIMARY KEY,
  image_url       TEXT NOT NULL,
  title           TEXT,
  link_product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'delivering', 'completed', 'cancelled')),
  items_total     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  delivery_total  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  grand_total     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT NOT NULL,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  comment         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_items (
  id              BIGSERIAL PRIMARY KEY,
  order_id        BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name    TEXT NOT NULL,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  price           NUMERIC(12, 2) NOT NULL,
  delivery_price  NUMERIC(12, 2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Singleton row: shop location shown to users, editable by admin only.
CREATE TABLE IF NOT EXISTS shop_settings (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  address         TEXT,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  map_url         TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO shop_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

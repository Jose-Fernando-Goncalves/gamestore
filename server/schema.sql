-- ============================================================================
-- Esquema do banco (SQLite) da loja HALLOW.
-- Executado uma vez no boot por `db.js` (CREATE TABLE IF NOT EXISTS).
-- ============================================================================

-- Usuários da loja. `role` controla o acesso ao painel admin ('user' | 'admin').
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'user',
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Catálogo de jogos. Fonte de verdade da loja (antes vivia em src/data/library.js).
-- Guardamos os campos "crus"; o front deriva capa/trailer/desconto via normalizeGame.
CREATE TABLE IF NOT EXISTS games (
  id           TEXT    PRIMARY KEY,
  title        TEXT    NOT NULL,
  genre        TEXT,
  price        REAL    NOT NULL DEFAULT 0,
  old_price    REAL,
  rating       REAL    NOT NULL DEFAULT 0,
  platforms    TEXT    NOT NULL DEFAULT '["PC"]', -- JSON array
  steam_app_id INTEGER,
  steam_movie  INTEGER,
  youtube      TEXT,
  cover        TEXT,
  badge        TEXT,
  accent       TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Pedidos (checkout mockado — `status` já nasce 'pago', sem gateway real).
CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total      REAL    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'pago',
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Itens de cada pedido — guardam o preço no momento da compra (snapshot).
CREATE TABLE IF NOT EXISTS order_items (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  game_id  TEXT    NOT NULL REFERENCES games(id),
  price    REAL    NOT NULL
);

-- Biblioteca: jogos que o usuário possui. Chave composta evita duplicatas.
CREATE TABLE IF NOT EXISTS library (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id     TEXT    NOT NULL REFERENCES games(id),
  acquired_at TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, game_id)
);

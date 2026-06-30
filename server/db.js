// ============================================================================
// Conexão SQLite (better-sqlite3 — síncrono, perfeito para SQLite).
// Abre/cria o arquivo do banco e aplica o schema no primeiro boot.
// ============================================================================

import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// O arquivo do banco fica em server/data/hallow.db (gitignored).
const DATA_DIR = join(__dirname, 'data');
mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = process.env.DB_PATH || join(DATA_DIR, 'hallow.db');

export const db = new Database(DB_PATH);

// Boa prática: WAL melhora concorrência de leitura; foreign_keys precisa ser
// ligado explicitamente no SQLite.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Aplica o schema (idempotente — tudo é CREATE TABLE IF NOT EXISTS).
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

export default db;

// ============================================================================
// Seed — popula o banco na primeira execução:
//   1) importa o catálogo de fábrica de src/data/library.js (50+ jogos);
//   2) cria um usuário admin inicial (credenciais via .env).
//
// Idempotente: usa INSERT OR IGNORE, então pode rodar quantas vezes quiser.
// Rode manualmente com:  npm run seed
// ============================================================================

import { pathToFileURL } from 'node:url';
import db from './db.js';
import { hashPassword } from './auth.js';
import { RAW } from '../src/data/gamesData.js';

// ---- Jogos -----------------------------------------------------------------
function seedGames() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO games
      (id, title, genre, price, old_price, rating, platforms,
       steam_app_id, steam_movie, youtube, cover, badge, accent)
    VALUES
      (@id, @title, @genre, @price, @old_price, @rating, @platforms,
       @steam_app_id, @steam_movie, @youtube, @cover, @badge, @accent)
  `);

  const tx = db.transaction((lista) => {
    for (const g of lista) {
      insert.run({
        id: g.id,
        title: g.title,
        genre: g.genre ?? null,
        price: g.price ?? 0,
        old_price: g.oldPrice ?? null,
        rating: g.rating ?? 0,
        platforms: JSON.stringify(g.platforms ?? ['PC']),
        steam_app_id: g.steamAppId ?? null,
        steam_movie: g.steamMovie ?? null,
        youtube: g.youtube ?? null,
        // Jogos do Steam derivam a capa do appId no front; só guardamos `cover`
        // explícito para os que não têm appId (ex.: re-requiem, gta6).
        cover: g.steamAppId ? null : g.cover ?? null,
        badge: g.badge ?? null,
        accent: g.accent ?? null,
      });
    }
  });

  tx(RAW);
  const total = db.prepare('SELECT COUNT(*) AS n FROM games').get().n;
  console.log(`  ✓ jogos no catálogo: ${total}`);
}

// ---- Admin inicial ---------------------------------------------------------
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@hallow.gg';
  const senha = process.env.ADMIN_PASSWORD || 'admin123';
  const nome = process.env.ADMIN_NAME || 'Admin HALLOW';

  const existe = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existe) {
    console.log(`  ✓ admin já existe: ${email}`);
    return;
  }
  const hash = await hashPassword(senha);
  db.prepare(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')`
  ).run(nome, email, hash);
  console.log(`  ✓ admin criado: ${email}  (senha: ${senha})`);
}

export async function runSeed() {
  console.log('› Populando o banco…');
  seedGames();
  await seedAdmin();
  console.log('› Seed concluído.\n');
}

// Permite rodar direto: `node server/seed.js` (ou `npm run seed`).
// pathToFileURL normaliza o caminho (Windows usa \, a URL usa /).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSeed().then(() => process.exit(0));
}

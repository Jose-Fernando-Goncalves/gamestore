// Biblioteca do usuário — os jogos que ele já possui. Exige login.
//   - GET  /api/library        lista os jogos adquiridos (no shape do catálogo)
//   - POST /api/library/claim  resgata jogos GRÁTIS (preço 0) para a biblioteca

import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../auth.js';
import { rowToGame } from '../util.js';

const router = Router();

// Lê a biblioteca do usuário no shape do catálogo (reutilizado nas duas rotas).
function lerBiblioteca(userId) {
  const rows = db
    .prepare(
      `SELECT g.*, l.acquired_at
       FROM library l
       JOIN games g ON g.id = l.game_id
       WHERE l.user_id = ?
       ORDER BY l.acquired_at DESC`
    )
    .all(userId);
  return rows.map((r) => ({ ...rowToGame(r), acquiredAt: r.acquired_at }));
}

router.get('/', requireAuth, (req, res) => {
  res.json(lerBiblioteca(req.user.id));
});

// Resgate de jogos grátis: { ids: [...] }. Usado ao logar (mescla a biblioteca
// que o convidado montou localmente) e ao resgatar um grátis já logado. Jogos
// PAGOS são ignorados aqui de propósito — eles só entram pelo checkout (/orders).
router.post('/claim', requireAuth, (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const getGame = db.prepare('SELECT id, price FROM games WHERE id = ?');
  const insLib = db.prepare(
    'INSERT OR IGNORE INTO library (user_id, game_id) VALUES (?, ?)'
  );

  const resgatar = db.transaction((lista) => {
    for (const id of lista) {
      const g = getGame.get(id);
      if (g && g.price === 0) insLib.run(req.user.id, g.id);
    }
  });
  resgatar(ids);

  res.status(201).json(lerBiblioteca(req.user.id));
});

export default router;

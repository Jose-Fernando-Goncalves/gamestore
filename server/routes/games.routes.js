// Rotas do catálogo de jogos.
//   - GET    /api/games        público  (lista)
//   - GET    /api/games/:id    público  (detalhe)
//   - POST   /api/games        admin     (criar)
//   - PUT    /api/games/:id     admin     (editar)
//   - DELETE /api/games/:id     admin     (remover)

import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../auth.js';
import { rowToGame } from '../util.js';

const router = Router();

// Gera um id em kebab-case a partir do título (quando o admin não informa um).
function slugify(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Monta o objeto de colunas a partir do corpo da requisição (cria/edita).
function gameColsFromBody(body) {
  return {
    title: body.title,
    genre: body.genre ?? null,
    price: Number(body.price) || 0,
    old_price: body.oldPrice != null && body.oldPrice !== '' ? Number(body.oldPrice) : null,
    rating: body.rating != null && body.rating !== '' ? Number(body.rating) : 0,
    platforms: JSON.stringify(
      Array.isArray(body.platforms) ? body.platforms : ['PC']
    ),
    steam_app_id: body.steamAppId ? Number(body.steamAppId) : null,
    steam_movie: body.steamMovie ? Number(body.steamMovie) : null,
    youtube: body.youtube || null,
    cover: body.cover || null,
    badge: body.badge || null,
    accent: body.accent || null,
  };
}

// ---- Público ---------------------------------------------------------------

// Lista o catálogo inteiro (mais novos primeiro).
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM games ORDER BY created_at DESC, title ASC').all();
  res.json(rows.map(rowToGame));
});

// Detalhe de um jogo.
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ erro: 'Jogo não encontrado.' });
  res.json(rowToGame(row));
});

// ---- Admin -----------------------------------------------------------------

// Cria um jogo.
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const body = req.body || {};
  if (!body.title) return res.status(400).json({ erro: 'O título é obrigatório.' });

  const id = body.id ? slugify(body.id) : slugify(body.title);
  if (db.prepare('SELECT id FROM games WHERE id = ?').get(id)) {
    return res.status(409).json({ erro: `Já existe um jogo com o id "${id}".` });
  }

  const cols = gameColsFromBody(body);
  db.prepare(
    `INSERT INTO games
       (id, title, genre, price, old_price, rating, platforms,
        steam_app_id, steam_movie, youtube, cover, badge, accent)
     VALUES
       (@id, @title, @genre, @price, @old_price, @rating, @platforms,
        @steam_app_id, @steam_movie, @youtube, @cover, @badge, @accent)`
  ).run({ id, ...cols });

  const row = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
  res.status(201).json(rowToGame(row));
});

// Edita um jogo existente.
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const existe = db.prepare('SELECT id FROM games WHERE id = ?').get(id);
  if (!existe) return res.status(404).json({ erro: 'Jogo não encontrado.' });
  if (!req.body?.title) return res.status(400).json({ erro: 'O título é obrigatório.' });

  const cols = gameColsFromBody(req.body);
  db.prepare(
    `UPDATE games SET
       title = @title, genre = @genre, price = @price, old_price = @old_price,
       rating = @rating, platforms = @platforms, steam_app_id = @steam_app_id,
       steam_movie = @steam_movie, youtube = @youtube, cover = @cover,
       badge = @badge, accent = @accent
     WHERE id = @id`
  ).run({ id, ...cols });

  const row = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
  res.json(rowToGame(row));
});

// Remove um jogo.
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const info = db.prepare('DELETE FROM games WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Jogo não encontrado.' });
  res.json({ ok: true });
});

export default router;

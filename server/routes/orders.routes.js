// Rotas de pedidos (checkout mockado) — todas exigem login.
//   - POST /api/orders   finaliza a compra do carrinho
//   - GET  /api/orders   histórico de pedidos do usuário

import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

// POST /api/orders  { items: [{ id, qty }] }
// O servidor NUNCA confia no preço do cliente: relê do banco e recalcula.
router.post('/', (req, res) => {
  const itens = Array.isArray(req.body?.items) ? req.body.items : [];
  if (itens.length === 0) {
    return res.status(400).json({ erro: 'Carrinho vazio.' });
  }

  const getGame = db.prepare('SELECT id, price FROM games WHERE id = ?');
  const linhas = [];
  for (const it of itens) {
    const g = getGame.get(it.id);
    if (!g) return res.status(400).json({ erro: `Jogo inválido no carrinho: ${it.id}` });
    const qty = Math.max(1, Number(it.qty) || 1);
    linhas.push({ id: g.id, price: g.price, qty });
  }

  const total = linhas.reduce((s, l) => s + l.price * l.qty, 0);
  const userId = req.user.id;

  // Tudo numa transação: cria o pedido, os itens e dá posse na biblioteca.
  const criar = db.transaction(() => {
    const info = db
      .prepare(`INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pago')`)
      .run(userId, total);
    const orderId = info.lastInsertRowid;

    const insItem = db.prepare(
      'INSERT INTO order_items (order_id, game_id, price) VALUES (?, ?, ?)'
    );
    const insLib = db.prepare(
      'INSERT OR IGNORE INTO library (user_id, game_id) VALUES (?, ?)'
    );
    for (const l of linhas) {
      insItem.run(orderId, l.id, l.price);
      insLib.run(userId, l.id); // duplicatas são ignoradas (já possui o jogo)
    }
    return orderId;
  });

  const orderId = criar();
  res.status(201).json({ id: orderId, total, status: 'pago', items: linhas });
});

// GET /api/orders  → pedidos do usuário (mais recentes primeiro) com seus itens.
router.get('/', (req, res) => {
  const pedidos = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);

  const getItens = db.prepare(`
    SELECT oi.game_id AS id, oi.price, g.title
    FROM order_items oi
    JOIN games g ON g.id = oi.game_id
    WHERE oi.order_id = ?
  `);

  const resposta = pedidos.map((p) => ({
    id: p.id,
    total: p.total,
    status: p.status,
    createdAt: p.created_at,
    items: getItens.all(p.id),
  }));
  res.json(resposta);
});

export default router;

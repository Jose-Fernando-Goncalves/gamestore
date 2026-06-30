// Rotas de autenticação: registro, login e dados do usuário logado.

import { Router } from 'express';
import db from '../db.js';
import {
  hashPassword,
  comparePassword,
  signToken,
  requireAuth,
} from '../auth.js';
import { asyncHandler } from '../util.js';

const router = Router();

// Remove o hash da senha antes de devolver o usuário ao cliente.
function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

// POST /api/auth/register  → cria conta e já devolve um token.
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ erro: 'A senha precisa ter ao menos 6 caracteres.' });
  }

  const jaExiste = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (jaExiste) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
  }

  const hash = await hashPassword(password);
  const info = db
    .prepare(`INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')`)
    .run(name, email, hash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  // signToken() é a sua implementação (server/auth.js).
  const token = signToken({ id: user.id, role: user.role });
  res.status(201).json({ token, user: publicUser(user) });
}));

// POST /api/auth/login  → valida senha e devolve token.
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  // Mensagem genérica de propósito (não revela se o e-mail existe).
  if (!user || !(await comparePassword(password, user.password_hash))) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
  }

  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: publicUser(user) });
}));

// GET /api/auth/me  → dados do usuário do token (revalida no servidor).
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  res.json({ user: publicUser(user) });
});

export default router;

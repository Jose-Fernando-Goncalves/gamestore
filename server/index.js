// ============================================================================
// Servidor HTTP da loja HALLOW (Express + SQLite).
// Em dev, o Vite faz proxy de /api → este servidor (veja vite.config.js),
// então não há dor de cabeça com CORS no navegador.
// ============================================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import db from './db.js';
import { runSeed } from './seed.js';
import authRoutes from './routes/auth.routes.js';
import gamesRoutes from './routes/games.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import libraryRoutes from './routes/library.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // liberado em dev; em produção restrinja a origin
app.use(express.json());

// Healthcheck simples.
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Rotas da API.
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/library', libraryRoutes);

// 404 para qualquer outra rota de API.
app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

// Handler de erro genérico (evita derrubar o processo).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// Garante que o banco tem catálogo e admin antes de aceitar requisições.
const precisaSeed = db.prepare('SELECT COUNT(*) AS n FROM games').get().n === 0;
if (precisaSeed) {
  await runSeed();
}

app.listen(PORT, () => {
  console.log(`\n🎮  API HALLOW rodando em http://localhost:${PORT}`);
  console.log(`    Healthcheck: http://localhost:${PORT}/api/health\n`);
});

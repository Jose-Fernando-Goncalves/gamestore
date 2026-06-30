import { RAW } from './gamesData';
import { ApiError } from './api';

const K = {
  users: 'hallow:mock:users',
  games: 'hallow:mock:games',
  orders: 'hallow:mock:orders',
  library: 'hallow:mock:library',
};

const ADMIN = {
  id: 1,
  name: 'Admin HALLOW',
  email: 'admin@hallow.gg',
  password: 'admin123',
  role: 'admin',
};

const read = (k, fb) => {
  try {
    const v = JSON.parse(globalThis.localStorage?.getItem(k) ?? 'null');
    return v ?? fb;
  } catch {
    return fb;
  }
};
const write = (k, v) => globalThis.localStorage?.setItem(k, JSON.stringify(v));

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const slugify = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function seed() {
  if (!globalThis.localStorage) return;
  if (!localStorage.getItem(K.games)) {
    write(K.games, RAW.map((g) => ({ ...g, createdAt: now() })));
  }
  if (!localStorage.getItem(K.users)) write(K.users, [ADMIN]);
}

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });
const makeToken = (u) => btoa(JSON.stringify({ id: u.id, role: u.role }));
const decode = (t) => {
  try {
    return JSON.parse(atob(t));
  } catch {
    return null;
  }
};

function currentUser(token) {
  const p = token ? decode(token) : null;
  if (!p) return null;
  return read(K.users, []).find((u) => u.id === p.id) || null;
}
function requireAuth(token) {
  const u = currentUser(token);
  if (!u) throw new ApiError('Autenticação necessária.', 401);
  return u;
}
function requireAdmin(u) {
  if (u.role !== 'admin') throw new ApiError('Acesso restrito a administradores.', 403);
}

function gameFromBody(body, id) {
  return {
    id,
    title: body.title,
    genre: body.genre || undefined,
    price: Number(body.price) || 0,
    oldPrice:
      body.oldPrice != null && body.oldPrice !== '' ? Number(body.oldPrice) : undefined,
    rating: body.rating != null && body.rating !== '' ? Number(body.rating) : 0,
    platforms: Array.isArray(body.platforms) && body.platforms.length ? body.platforms : ['PC'],
    steamAppId: body.steamAppId ? Number(body.steamAppId) : undefined,
    steamMovie: body.steamMovie ? Number(body.steamMovie) : undefined,
    youtube: body.youtube || undefined,
    cover: body.cover || undefined,
    badge: body.badge || undefined,
    accent: body.accent || undefined,
  };
}

function libraryOf(userId) {
  const games = read(K.games, []);
  return read(K.library, [])
    .filter((e) => e.userId === userId)
    .sort((a, b) => (a.acquiredAt < b.acquiredAt ? 1 : -1))
    .map((e) => {
      const g = games.find((x) => x.id === e.gameId);
      return g ? { ...g, acquiredAt: e.acquiredAt } : null;
    })
    .filter(Boolean);
}

export function mockRoute(path, method = 'GET', body = undefined, token = null) {
  seed();
  const m = method.toUpperCase();

  if (path === '/auth/register' && m === 'POST') {
    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      throw new ApiError('Nome, e-mail e senha são obrigatórios.', 400);
    }
    if (password.length < 6) {
      throw new ApiError('A senha precisa ter ao menos 6 caracteres.', 400);
    }
    const users = read(K.users, []);
    if (users.some((u) => u.email === email)) {
      throw new ApiError('Este e-mail já está cadastrado.', 409);
    }
    const id = users.reduce((mx, u) => Math.max(mx, u.id), 0) + 1;
    const user = { id, name, email, password, role: 'user' };
    users.push(user);
    write(K.users, users);
    return { token: makeToken(user), user: publicUser(user) };
  }

  if (path === '/auth/login' && m === 'POST') {
    const { email, password } = body || {};
    if (!email || !password) throw new ApiError('Informe e-mail e senha.', 400);
    const user = read(K.users, []).find((u) => u.email === email);
    if (!user || user.password !== password) {
      throw new ApiError('E-mail ou senha inválidos.', 401);
    }
    return { token: makeToken(user), user: publicUser(user) };
  }

  if (path === '/auth/me' && m === 'GET') {
    return { user: publicUser(requireAuth(token)) };
  }

  if (path === '/games' && m === 'GET') {
    return [...read(K.games, [])].sort((a, b) =>
      b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : a.title.localeCompare(b.title)
    );
  }

  if (path === '/games' && m === 'POST') {
    requireAdmin(requireAuth(token));
    if (!body?.title) throw new ApiError('O título é obrigatório.', 400);
    const games = read(K.games, []);
    const id = body.id ? slugify(body.id) : slugify(body.title);
    if (games.some((g) => g.id === id)) {
      throw new ApiError(`Já existe um jogo com o id "${id}".`, 409);
    }
    const game = { ...gameFromBody(body, id), createdAt: now() };
    games.push(game);
    write(K.games, games);
    return game;
  }

  const gm = path.match(/^\/games\/(.+)$/);
  if (gm) {
    const id = decodeURIComponent(gm[1]);
    const games = read(K.games, []);
    if (m === 'GET') {
      const g = games.find((x) => x.id === id);
      if (!g) throw new ApiError('Jogo não encontrado.', 404);
      return g;
    }
    if (m === 'PUT') {
      requireAdmin(requireAuth(token));
      const idx = games.findIndex((x) => x.id === id);
      if (idx < 0) throw new ApiError('Jogo não encontrado.', 404);
      if (!body?.title) throw new ApiError('O título é obrigatório.', 400);
      const updated = { ...gameFromBody(body, id), createdAt: games[idx].createdAt };
      games[idx] = updated;
      write(K.games, games);
      return updated;
    }
    if (m === 'DELETE') {
      requireAdmin(requireAuth(token));
      const next = games.filter((x) => x.id !== id);
      if (next.length === games.length) throw new ApiError('Jogo não encontrado.', 404);
      write(K.games, next);
      return { ok: true };
    }
  }

  if (path === '/orders' && m === 'POST') {
    const user = requireAuth(token);
    const itens = Array.isArray(body?.items) ? body.items : [];
    if (itens.length === 0) throw new ApiError('Carrinho vazio.', 400);
    const games = read(K.games, []);
    const linhas = [];
    for (const it of itens) {
      const g = games.find((x) => x.id === it.id);
      if (!g) throw new ApiError(`Jogo inválido no carrinho: ${it.id}`, 400);
      linhas.push({ id: g.id, price: g.price, qty: Math.max(1, Number(it.qty) || 1) });
    }
    const total = linhas.reduce((s, l) => s + l.price * l.qty, 0);
    const orders = read(K.orders, []);
    const id = orders.reduce((mx, o) => Math.max(mx, o.id), 0) + 1;
    orders.unshift({
      id,
      userId: user.id,
      total,
      status: 'pago',
      createdAt: now(),
      items: linhas.map((l) => ({
        id: l.id,
        price: l.price,
        title: games.find((g) => g.id === l.id)?.title,
      })),
    });
    write(K.orders, orders);
    const lib = read(K.library, []);
    for (const l of linhas) {
      if (!lib.some((e) => e.userId === user.id && e.gameId === l.id)) {
        lib.push({ userId: user.id, gameId: l.id, acquiredAt: now() });
      }
    }
    write(K.library, lib);
    return { id, total, status: 'pago', items: linhas };
  }

  if (path === '/orders' && m === 'GET') {
    const user = requireAuth(token);
    return read(K.orders, [])
      .filter((o) => o.userId === user.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((o) => ({
        id: o.id,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        items: o.items,
      }));
  }

  if (path === '/library' && m === 'GET') {
    return libraryOf(requireAuth(token).id);
  }

  if (path === '/library/claim' && m === 'POST') {
    const user = requireAuth(token);
    const ids = Array.isArray(body?.ids) ? body.ids : [];
    const games = read(K.games, []);
    const lib = read(K.library, []);
    for (const id of ids) {
      const g = games.find((x) => x.id === id);
      if (g && g.price === 0 && !lib.some((e) => e.userId === user.id && e.gameId === g.id)) {
        lib.push({ userId: user.id, gameId: g.id, acquiredAt: now() });
      }
    }
    write(K.library, lib);
    return libraryOf(user.id);
  }

  throw new ApiError('Rota não encontrada.', 404);
}

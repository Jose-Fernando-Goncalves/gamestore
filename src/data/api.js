// ============================================================================
// Cliente HTTP da API HALLOW. Centraliza o fetch, injeta o token JWT e
// padroniza o tratamento de erro. Em dev, o Vite faz proxy de /api → :3001.
// ============================================================================

import { mockRoute } from './apiMock';

const MOCK = import.meta.env.VITE_MOCK === 'true';
const TOKEN_KEY = 'hallow:token';

export const getToken = () => globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
export const setToken = (t) =>
  t
    ? globalThis.localStorage?.setItem(TOKEN_KEY, t)
    : globalThis.localStorage?.removeItem(TOKEN_KEY);

// Erro com o status HTTP e a mensagem vinda do servidor (campo `erro`).
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function req(path, { method = 'GET', body } = {}) {
  if (MOCK) return mockRoute(path, method, body, getToken());

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.erro || 'Falha na requisição.', res.status, data);
  }
  return data;
}

// ---- Auth ------------------------------------------------------------------
export const authRegister = (name, email, password) =>
  req('/auth/register', { method: 'POST', body: { name, email, password } });
export const authLogin = (email, password) =>
  req('/auth/login', { method: 'POST', body: { email, password } });
export const authMe = () => req('/auth/me');

// ---- Jogos -----------------------------------------------------------------
export const listGames = () => req('/games');
export const getGame = (id) => req(`/games/${id}`);
export const createGame = (data) => req('/games', { method: 'POST', body: data });
export const updateGame = (id, data) =>
  req(`/games/${id}`, { method: 'PUT', body: data });
export const deleteGame = (id) => req(`/games/${id}`, { method: 'DELETE' });

// ---- Pedidos & biblioteca --------------------------------------------------
export const createOrder = (items) =>
  req('/orders', { method: 'POST', body: { items } });
export const listOrders = () => req('/orders');
export const listLibrary = () => req('/library');
// Resgata jogos grátis (preço 0) para a biblioteca; o servidor ignora pagos.
export const claimLibrary = (ids) =>
  req('/library/claim', { method: 'POST', body: { ids } });

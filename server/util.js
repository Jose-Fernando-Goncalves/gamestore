// Utilitários compartilhados pelas rotas.

// Envolve um handler async para que erros (Promises rejeitadas) sejam
// encaminhados ao error handler do Express — que no Express 4 não captura
// rejeições automaticamente. Sem isto, um throw dentro de um handler async
// deixaria a requisição pendurada.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Converte uma linha da tabela `games` (snake_case) para o formato camelCase
// que o front já consome — o mesmo shape de src/data/library.js, de modo que o
// `normalizeGame()` do front consegue derivar capa/trailer/desconto sem mudanças.
export function rowToGame(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    genre: row.genre ?? undefined,
    platforms: safeParse(row.platforms, ['PC']),
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    rating: row.rating ?? 0,
    badge: row.badge ?? undefined,
    steamAppId: row.steam_app_id ?? undefined,
    steamMovie: row.steam_movie ?? undefined,
    youtube: row.youtube ?? undefined,
    cover: row.cover ?? undefined,
    accent: row.accent ?? undefined,
    createdAt: row.created_at,
  };
}

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

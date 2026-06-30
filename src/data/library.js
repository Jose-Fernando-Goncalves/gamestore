// ============================================================================
// BIBLIOTECA DE JOGOS — fonte única de verdade.
// ----------------------------------------------------------------------------
// Este arquivo concentra TODOS os jogos usados no projeto. As seções da home
// (catálogo em destaque, ofertas, tópicos, retrô) continuam com suas curadorias
// próprias, mas a página de Catálogo (/catalogo) e o futuro cadastro de jogos
// leem daqui.
//
// COMO ADICIONAR JOGOS NO FUTURO:
//  - Jogos "de fábrica" (fixos do projeto): adicione um objeto em `RAW` abaixo.
//  - Jogos cadastrados pelo usuário (ex.: após login): NÃO edite este arquivo —
//    eles entram pelo armazenamento assíncrono em `gameStore.js` (localStorage,
//    no espírito do AsyncStorage) e são mesclados por cima desta lista.
//
// Cada entrada passa pelo `make()`, que deriva os campos calculados (desconto,
// capa, trailer do Steam, acento) — nunca cravar URLs de capa nos componentes.
// `genre` é o gênero amplo usado no filtro do catálogo.
// ============================================================================

import { steamCapsule, ytThumb, steamTrailer } from './catalog';
import { RAW } from './gamesData';

// Acento padrão por gênero (usado quando a entrada não define um `accent`).
const GENRE_ACCENT = {
  'Action RPG': '#e8b873',
  RPG: '#c084fc',
  Aventura: '#38bdf8',
  Ação: '#fb7185',
  Terror: '#ff4747',
  FPS: '#f97316',
  Estratégia: '#facc15',
  Luta: '#f43f5e',
  MOBA: '#60a5fa',
  Esporte: '#22d3ee',
  Indie: '#34d399',
};

// Em promoção quando há `oldPrice` maior que `price` (mesma convenção do resto
// do projeto). `make()` deriva o desconto a partir disso.
const make = (g) => {
  const emOferta = g.oldPrice && g.oldPrice > g.price;
  return {
    ...g,
    platforms: g.platforms ?? ['PC'],
    rating: g.rating ?? 0,
    accent: g.accent ?? GENRE_ACCENT[g.genre] ?? '#d6ff3f',
    discount: emOferta ? Math.round((1 - g.price / g.oldPrice) * 100) : 0,
    cover: g.steamAppId ? steamCapsule(g.steamAppId) : g.cover ?? ytThumb(g.youtube),
    fallback: ytThumb(g.youtube),
    trailer: g.steamMovie ? steamTrailer(g.steamMovie) : null,
  };
};

// Lista de fábrica (jogos fixos do projeto), já normalizada. Os dados crus vêm
// de `gamesData.js` (módulo puro, compartilhado com o seed do servidor).
export const gamesLibrary = RAW.map(make);

// Reaproveita o `make()` para normalizar jogos vindos de fora (ex.: cadastrados
// pelo usuário e persistidos no gameStore), garantindo os mesmos campos.
export const normalizeGame = make;

// Gêneros distintos presentes na biblioteca, com a contagem de títulos — usado
// para montar os filtros do catálogo dinamicamente (sem listas hardcoded).
export function genreFacets(games = gamesLibrary) {
  const contagem = new Map();
  for (const g of games) contagem.set(g.genre, (contagem.get(g.genre) ?? 0) + 1);
  return [...contagem.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

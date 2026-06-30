// Catálogo da loja. A capa de cada jogo vem do thumbnail do trailer no YouTube
// (maxresdefault). Se faltar, o card cai no gradiente da cor do jogo.

export const catalog = [
  {
    id: 'spiderman2',
    title: "Marvel's Spider-Man 2",
    genre: 'Aventura',
    platforms: ['PS5', 'PC'],
    price: 299.9,
    oldPrice: 349.9,
    discount: 14,
    rating: 9.1,
    badge: 'Mais vendido',
    youtube: '9fVYKsEmuRo',
    steamAppId: 2651280,
    steamMovie: 257093509,
    accent: '#38bdf8',
  },
  {
    id: 'black-myth',
    title: 'Black Myth: Wukong',
    genre: 'Action RPG',
    platforms: ['PS5', 'PC', 'Xbox'],
    price: 249.9,
    oldPrice: 249.9,
    discount: 0,
    rating: 8.8,
    badge: 'Lançamento',
    youtube: '_mAnlVXtDD8',
    steamAppId: 2358720,
    steamMovie: 257048125,
    accent: '#ffb02e',
  },
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077',
    genre: 'Action RPG',
    platforms: ['PS5', 'PC', 'Xbox'],
    price: 99.9,
    oldPrice: 249.9,
    discount: 60,
    rating: 9.0,
    badge: 'Promoção',
    youtube: 'P99qJGrPNLs',
    steamAppId: 1091500,
    steamMovie: 257082775,
    accent: '#fcee0a',
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    genre: 'Action RPG',
    platforms: ['PS5', 'PC', 'Xbox'],
    price: 149.9,
    oldPrice: 249.9,
    discount: 40,
    rating: 9.6,
    badge: 'Promoção',
    youtube: 'E3Huy2cdih0',
    steamAppId: 1245620,
    steamMovie: 256889452,
    accent: '#e8b873',
  },
  {
    id: 'gow-ragnarok',
    title: 'God of War Ragnarök',
    genre: 'Aventura',
    platforms: ['PS5', 'PC'],
    price: 179.9,
    oldPrice: 299.9,
    discount: 40,
    rating: 9.4,
    badge: 'Promoção',
    youtube: 'EE-4GvjKcfs',
    steamAppId: 2322010,
    steamMovie: 257054534,
    accent: '#cf3b3b',
  },
  {
    id: 'ff16',
    title: 'Final Fantasy XVI',
    genre: 'Action RPG',
    platforms: ['PS5', 'PC'],
    price: 199.9,
    oldPrice: 299.9,
    discount: 33,
    rating: 8.7,
    badge: 'Promoção',
    youtube: 'Xr1ZnsYu1wU',
    steamAppId: 2515020,
    steamMovie: 257046858,
    accent: '#ff7a3d',
  },
  {
    id: 're-requiem',
    title: 'Resident Evil Requiem',
    genre: 'Terror',
    platforms: ['PS5', 'PC', 'Xbox'],
    price: 299.9,
    oldPrice: 349.9,
    discount: 14,
    rating: 9.3,
    badge: 'Pré-venda',
    youtube: 'POz1-EmLsTY',
    cover: '/covers/re-requiem.jpg', // age-gated no Steam: coloque a capa oficial aqui
    accent: '#ff4747',
  },
  {
    id: 'gta6',
    title: 'Grand Theft Auto VI',
    genre: 'Aventura',
    platforms: ['PS5', 'Xbox'],
    price: 349.9,
    oldPrice: 349.9,
    discount: 0,
    rating: 0,
    badge: 'Pré-venda',
    youtube: 'QdBZY2fkU-0',
    cover: '/covers/gta6.jpg', // sem capsule no Steam ainda: coloque a capa oficial aqui
    accent: '#ff5aa8',
  },
];

export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

// Trailer servido pelo próprio Steam (arquivo de vídeo direto, não YouTube).
// `movieId` é o ID do trailer (≠ appId), obtido via API pública appdetails.
// Usamos o movie480.mp4 (h264): é o único arquivo direto presente para todos
// os trailers que têm versão estática — leve o suficiente p/ a prévia no hover.
export const steamTrailer = (movieId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${movieId}/movie480.mp4`;

// Capsule oficial do Steam (card de loja).
export const steamCapsule = (appId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

// Arte cinemática larga da biblioteca do Steam — ótima como fundo do hero
// da página de detalhes (~1920x620). Confiável para a maioria dos apps.
export const steamHero = (appId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_hero.jpg`;

// Capsule larga (616x353) — usada como item extra na galeria de mídia.
export const steamWide = (appId) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`;

// Fontes de capa em ordem de preferência: capa oficial primeiro, thumbnail
// do trailer só como último recurso. O GameCard tenta a próxima ao falhar.
export const coverSources = (g) => {
  const list = [];
  if (g.steamAppId) list.push(steamCapsule(g.steamAppId));
  if (g.cover) list.push(g.cover);
  list.push(ytThumb(g.youtube));
  return list;
};

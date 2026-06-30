// Seção "Aventuras Retrô" — clássicos modernos com pegada Zelda/medieval
// (pixel art, action-RPG, masmorras). Capa oficial do Steam + trailer real.
// Preços/descontos são mockados.

import { steamCapsule, ytThumb, steamTrailer } from './catalog';

// Sem `oldPrice` = preço cheio (sem promoção). Com `oldPrice` = em oferta.
const make = (g) => ({
  ...g,
  discount: g.oldPrice ? Math.round((1 - g.price / g.oldPrice) * 100) : 0,
  cover: steamCapsule(g.steamAppId),
  fallback: ytThumb(g.youtube),
  trailer: g.steamMovie ? steamTrailer(g.steamMovie) : null,
});

export const retroGames = [
  make({ id: 'tunic', title: 'TUNIC', kind: 'Zelda-like', year: 2022, steamAppId: 553420, steamMovie: 256863992, youtube: '-9Puf9aJZHE', price: 74.9 }),
  make({ id: 'deaths-door', title: "DEATH'S DOOR", kind: 'Action-Adventure', year: 2021, steamAppId: 894020, steamMovie: 256844444, youtube: '3JLqdTd1zZc', price: 29.9, oldPrice: 59.9 }),
  make({ id: 'hyper-light', title: 'HYPER LIGHT DRIFTER', kind: 'Pixel RPG', year: 2016, steamAppId: 257850, steamMovie: 256661723, youtube: 'bafkb0eVKZ4', price: 19.9, oldPrice: 49.9 }),
  make({ id: 'blasphemous', title: 'BLASPHEMOUS', kind: 'Metroidvania', year: 2019, steamAppId: 774361, steamMovie: 256761817, youtube: 'sAr82xVcViU', price: 24.9, oldPrice: 54.9 }),
  make({ id: 'crosscode', title: 'CROSSCODE', kind: 'Action RPG', year: 2018, steamAppId: 368340, steamMovie: 256668686, youtube: 'A5oMvF24EhM', price: 64.9 }),
  make({ id: 'moonlighter', title: 'MOONLIGHTER', kind: 'Dungeon RPG', year: 2018, steamAppId: 606150, steamMovie: 256892422, youtube: 'C03lTPaffjA', price: 18.9, oldPrice: 44.9 }),
  make({ id: 'eastward', title: 'EASTWARD', kind: 'Adventure', year: 2021, steamAppId: 977880, steamMovie: 256851826, youtube: 'algSDB52VPg', price: 39.9, oldPrice: 74.9 }),
  make({ id: 'sea-of-stars', title: 'SEA OF STARS', kind: 'Turn-based RPG', year: 2023, steamAppId: 1244090, steamMovie: 256995688, youtube: 'i_oqWXEQjt0', price: 99.9 }),
];

// Tema fixo do cenário — "Reino Sagrado" (céu, brasão, ouro e destaque).
export const retroTheme = {
  '--sky-1': '#2a567f',
  '--sky-2': '#13294a',
  '--ink': '#0a1626',
  '--gold': '#ffe08a',
  '--accent': '#8fd0ff',
  '--hill': '#0d1f33',
  '--mist': 'rgba(255,224,138,0.2)',
};

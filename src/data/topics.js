// Tópicos da home — cada um vira uma linha com carrossel horizontal de cards.
// Os jogos vêm da biblioteca (library.js), então os cards ficam idênticos aos do
// resto do site; aqui só escolhemos os ids e o preço/oferta de cada linha.
// Sem `oldPrice` = preço cheio; com `oldPrice` = em oferta.

import { gamesLibrary } from './library';

const byId = Object.fromEntries(gamesLibrary.map((g) => [g.id, g]));

const make = ({ id, price, oldPrice }) => {
  const base = byId[id];
  const p = price ?? base.price;
  return {
    ...base,
    price: p,
    oldPrice,
    discount: oldPrice && oldPrice > p ? Math.round((1 - p / oldPrice) * 100) : 0,
  };
};

export const topics = [
  {
    id: 'medieval',
    title: 'Medieval',
    tagline: 'Espadas, castelos e reinos para conquistar',
    games: [
      make({ id: 'elden-ring', price: 119.9, oldPrice: 249.9 }),
      make({ id: 'kcd2', price: 249.9 }),
      make({ id: 'witcher3', price: 39.9, oldPrice: 129.9 }),
      make({ id: 'bannerlord', price: 199.9 }),
      make({ id: 'ck3', price: 179.9 }),
      make({ id: 'chivalry2', price: 129.9 }),
    ],
  },
  {
    id: 'acao',
    title: 'Ação',
    tagline: 'Adrenalina pura, do começo ao fim',
    games: [
      make({ id: 'gow', price: 69.9, oldPrice: 199.9 }),
      make({ id: 'dmc5', price: 199.9 }),
      make({ id: 'doom-eternal', price: 49.9, oldPrice: 149.9 }),
      make({ id: 'sekiro', price: 199.9 }),
      make({ id: 'spiderman', price: 249.9 }),
      make({ id: 'black-myth', price: 249.9 }),
    ],
  },
  {
    id: 'competitivo',
    title: 'Competitivo',
    tagline: 'Suba de ranque e prove quem manda',
    games: [
      make({ id: 'cs2', price: 0 }),
      make({ id: 'dota2', price: 0 }),
      make({ id: 'r6', price: 39.9, oldPrice: 99.9 }),
      make({ id: 'apex', price: 0 }),
      make({ id: 'rocket-league', price: 0 }),
      make({ id: 'sf6', price: 249.9 }),
      make({ id: 'dbd', price: 29.9, oldPrice: 79.9 }),
    ],
  },
  {
    id: 'terror',
    title: 'Terror',
    tagline: 'Não é pra cardíacos — apague as luzes',
    games: [
      make({ id: 're-village', price: 79.9, oldPrice: 199.9 }),
      make({ id: 're4-remake', price: 249.9 }),
      make({ id: 'dead-space', price: 99.9, oldPrice: 249.9 }),
      make({ id: 'silent-hill-2', price: 249.9 }),
      make({ id: 'alien-isolation', price: 79.9 }),
      make({ id: 'phasmophobia', price: 49.9 }),
    ],
  },
  {
    id: 'mundo-aberto',
    title: 'Mundo Aberto',
    tagline: 'Mapas gigantes pra se perder por horas',
    games: [
      make({ id: 'cyberpunk', price: 99.9, oldPrice: 249.9 }),
      make({ id: 'rdr2', price: 79.9, oldPrice: 299.9 }),
      make({ id: 'hogwarts', price: 299.9 }),
      make({ id: 'horizon', price: 199.9 }),
      make({ id: 'ghost-tsushima', price: 249.9 }),
      make({ id: 'ac-valhalla', price: 249.9 }),
    ],
  },
  {
    id: 'indie',
    title: 'Indie',
    tagline: 'Joias independentes que viraram clássicos',
    games: [
      make({ id: 'hollow-knight', price: 14.9, oldPrice: 27.9 }),
      make({ id: 'hades', price: 69.9 }),
      make({ id: 'stardew', price: 34.9 }),
      make({ id: 'celeste', price: 12.9, oldPrice: 36.9 }),
      make({ id: 'cuphead', price: 44.9 }),
      make({ id: 'dead-cells', price: 27.9 }),
    ],
  },
];

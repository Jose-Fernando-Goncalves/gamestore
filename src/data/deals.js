// Ofertas (mockadas) do "Festival de Inverno". Os jogos vêm da biblioteca
// (library.js) — então capa, trailer, plataformas, nota e acento ficam idênticos
// aos dos demais cards; aqui só sobrescrevemos o preço/oferta do festival.

import { gamesLibrary } from './library';

const byId = Object.fromEntries(gamesLibrary.map((g) => [g.id, g]));

const make = ({ id, price, oldPrice }) => ({
  ...byId[id],
  price,
  oldPrice,
  discount: Math.round((1 - price / oldPrice) * 100),
});

export const winterDeals = [
  make({ id: 'elden-ring', price: 119.9, oldPrice: 249.9 }),
  make({ id: 'rdr2', price: 79.9, oldPrice: 299.9 }),
  make({ id: 'bg3', price: 149.9, oldPrice: 199.9 }),
  make({ id: 'cyberpunk', price: 99.9, oldPrice: 249.9 }),
  make({ id: 'witcher3', price: 39.9, oldPrice: 129.9 }),
  make({ id: 'gow', price: 69.9, oldPrice: 199.9 }),
  make({ id: 'hades', price: 29.9, oldPrice: 69.9 }),
  make({ id: 'hogwarts', price: 129.9, oldPrice: 299.9 }),
];

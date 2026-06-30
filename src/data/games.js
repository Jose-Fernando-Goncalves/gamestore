// Catálogo em destaque do carrossel do hero.
// `youtube` = ID do vídeo do trailer oficial (reproduzido como fundo, mudo+loop).
// `start` = segundo inicial para pular intros e cair direto na ação.
// Se o embed falhar, o pôster animado (gradiente) é exibido como fallback.

export const featured = [
  {
    id: 're-requiem',
    title: 'RESIDENT EVIL',
    subtitle: 'Requiem',
    genre: 'Survival Horror',
    tags: ['Single-player', 'Terror', 'RE Engine'],
    rating: 9.3,
    studio: 'Capcom',
    year: 2026,
    price: 299.9,
    oldPrice: 349.9,
    discount: 14,
    badge: 'Pré-venda',
    cover: '/covers/re-requiem.jpg',
    youtube: 'POz1-EmLsTY',
    start: 6,
    poster:
      'radial-gradient(120% 130% at 25% 10%, #3a0d0d 0%, #160707 45%, #07070a 100%)',
    accent: '#ff4747',
    glow: 'rgba(255,71,71,0.22)',
  },
  {
    id: 'cyberpunk',
    title: 'CYBERPUNK 2077',
    subtitle: 'Ultimate Edition',
    genre: 'Open-World RPG',
    tags: ['Mundo Aberto', 'Ray Tracing', 'Night City'],
    rating: 9.0,
    studio: 'CD PROJEKT RED',
    year: 2020,
    price: 159.9,
    oldPrice: 249.9,
    discount: 36,
    steamAppId: 1091500,
    youtube: 'P99qJGrPNLs',
    start: 6,
    poster:
      'radial-gradient(120% 130% at 80% 0%, #2c2a05 0%, #14140a 45%, #07070a 100%)',
    accent: '#fcee0a',
    glow: 'rgba(252,238,10,0.18)',
  },
  {
    id: 'hogwarts',
    title: 'HOGWARTS LEGACY',
    subtitle: 'O Legado é Seu',
    genre: 'RPG de Mundo Aberto',
    tags: ['Mundo Aberto', 'Magia', 'Single-player'],
    rating: 8.5,
    studio: 'Avalanche Software',
    year: 2023,
    price: 149.9,
    oldPrice: 299.9,
    discount: 50,
    steamAppId: 990080,
    youtube: '1O6Qstncpnc',
    start: 6,
    poster:
      'radial-gradient(120% 130% at 70% 12%, #2e1d05 0%, #16100a 45%, #07070a 100%)',
    accent: '#f0b450',
    glow: 'rgba(240,180,80,0.20)',
  },
  {
    id: 'spiderman2',
    title: "MARVEL'S SPIDER-MAN 2",
    subtitle: 'Be Greater. Together.',
    genre: 'Action Adventure',
    tags: ['Peter & Miles', 'Symbiote', 'Mundo Aberto'],
    rating: 9.1,
    studio: 'Insomniac Games',
    year: 2023,
    price: 299.9,
    oldPrice: 349.9,
    discount: 14,
    steamAppId: 2651280,
    youtube: '9fVYKsEmuRo',
    start: 3,
    poster:
      'radial-gradient(120% 130% at 30% 15%, #07223a 0%, #06121f 45%, #07070a 100%)',
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.20)',
  },
];

export const fmtBRL = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

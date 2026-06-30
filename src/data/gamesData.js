// ============================================================================
// DADOS CRUS DOS JOGOS DE FÁBRICA — módulo puro, sem nenhum import.
// ----------------------------------------------------------------------------
// É deliberadamente "burro" (só um array) para poder ser consumido tanto pelo
// front (src/data/library.js, que deriva capa/trailer via make()) quanto pelo
// servidor Node (server/seed.js), que importa este arquivo sem arrastar junto
// o catalog.js — Node ESM exige extensão e não resolveria os imports do front.
//
// COMO ADICIONAR JOGOS DE FÁBRICA: inclua um objeto aqui. Jogos cadastrados
// pelo admin em runtime NÃO entram neste arquivo — vão direto para o banco.
// ============================================================================

export const RAW = [
  // ===== AAA / destaques =====
  { id: 'spiderman2', title: "Marvel's Spider-Man 2", genre: 'Aventura', platforms: ['PS5', 'PC'], price: 299.9, oldPrice: 349.9, rating: 9.1, badge: 'Mais vendido', steamAppId: 2651280, steamMovie: 257093509, youtube: '9fVYKsEmuRo', accent: '#38bdf8' },
  { id: 'black-myth', title: 'Black Myth: Wukong', genre: 'Action RPG', platforms: ['PS5', 'PC', 'Xbox'], price: 249.9, rating: 8.8, badge: 'Lançamento', steamAppId: 2358720, steamMovie: 257048125, youtube: '_mAnlVXtDD8', accent: '#ffb02e' },
  { id: 'cyberpunk', title: 'Cyberpunk 2077', genre: 'Action RPG', platforms: ['PS5', 'PC', 'Xbox'], price: 99.9, oldPrice: 249.9, rating: 9.0, badge: 'Promoção', steamAppId: 1091500, steamMovie: 257082775, youtube: 'P99qJGrPNLs', accent: '#fcee0a' },
  { id: 'elden-ring', title: 'Elden Ring', genre: 'Action RPG', platforms: ['PS5', 'PC', 'Xbox'], price: 149.9, oldPrice: 249.9, rating: 9.6, badge: 'Promoção', steamAppId: 1245620, steamMovie: 256889452, youtube: 'E3Huy2cdih0', accent: '#e8b873' },
  { id: 'gow-ragnarok', title: 'God of War Ragnarök', genre: 'Aventura', platforms: ['PS5', 'PC'], price: 179.9, oldPrice: 299.9, rating: 9.4, badge: 'Promoção', steamAppId: 2322010, steamMovie: 257054534, youtube: 'EE-4GvjKcfs', accent: '#cf3b3b' },
  { id: 'ff16', title: 'Final Fantasy XVI', genre: 'Action RPG', platforms: ['PS5', 'PC'], price: 199.9, oldPrice: 299.9, rating: 8.7, badge: 'Promoção', steamAppId: 2515020, steamMovie: 257046858, youtube: 'Xr1ZnsYu1wU', accent: '#ff7a3d' },
  { id: 're-requiem', title: 'Resident Evil Requiem', genre: 'Terror', platforms: ['PS5', 'PC', 'Xbox'], price: 299.9, oldPrice: 349.9, rating: 9.3, badge: 'Pré-venda', youtube: 'POz1-EmLsTY', cover: '/covers/re-requiem.jpg', accent: '#ff4747' },
  { id: 'gta6', title: 'Grand Theft Auto VI', genre: 'Aventura', platforms: ['PS5', 'Xbox'], price: 349.9, rating: 0, badge: 'Pré-venda', youtube: 'QdBZY2fkU-0', cover: '/covers/gta6.jpg', accent: '#ff5aa8' },

  // ===== Mundo aberto / aventura =====
  { id: 'rdr2', title: 'Red Dead Redemption 2', genre: 'Aventura', platforms: ['PC', 'PS5', 'Xbox'], price: 79.9, oldPrice: 299.9, rating: 9.7, steamAppId: 1174180, steamMovie: 256767979, youtube: 'gmA6MrX81z4' },
  { id: 'hogwarts', title: 'Hogwarts Legacy', genre: 'Aventura', platforms: ['PC', 'PS5', 'Xbox'], price: 129.9, oldPrice: 299.9, rating: 8.4, steamAppId: 990080, steamMovie: 256930503, youtube: '1O6Qstncpnc' },
  { id: 'horizon', title: 'Horizon Zero Dawn', genre: 'Action RPG', platforms: ['PC', 'PS5'], price: 199.9, rating: 8.9, steamAppId: 1151640, steamMovie: 256899640, youtube: 'u4-FCsiF5x4' },
  { id: 'ghost-tsushima', title: 'Ghost of Tsushima', genre: 'Aventura', platforms: ['PC', 'PS5'], price: 249.9, rating: 9.2, steamAppId: 2215430, steamMovie: 257022043, youtube: 'Tx2Boq8izEU' },
  { id: 'ac-valhalla', title: "Assassin's Creed Valhalla", genre: 'Action RPG', platforms: ['PC', 'PS5', 'Xbox'], price: 249.9, rating: 8.2, steamAppId: 2208920, steamMovie: 256917310, youtube: 'ssrNcwxALS4' },
  { id: 'gow', title: 'God of War', genre: 'Aventura', platforms: ['PC', 'PS5'], price: 69.9, oldPrice: 199.9, rating: 9.4, steamAppId: 1593500, steamMovie: 256864004, youtube: 'EmEEWzagVcg' },
  { id: 'spiderman', title: "Marvel's Spider-Man Remastered", genre: 'Aventura', platforms: ['PC', 'PS5'], price: 249.9, rating: 8.9, steamAppId: 1817070, steamMovie: 256900369, youtube: '9fVYKsEmuRo' },

  // ===== RPG / medieval / estratégia =====
  { id: 'bg3', title: "Baldur's Gate 3", genre: 'RPG', platforms: ['PC', 'PS5', 'Xbox'], price: 149.9, oldPrice: 199.9, rating: 9.6, steamAppId: 1086940, steamMovie: 256987424, youtube: '1T22wNvoNiU' },
  { id: 'witcher3', title: 'The Witcher 3: Wild Hunt', genre: 'Action RPG', platforms: ['PC', 'PS5', 'Xbox'], price: 39.9, oldPrice: 129.9, rating: 9.5, steamAppId: 292030, steamMovie: 256927229, youtube: 'c0i88t0Kacs' },
  { id: 'kcd2', title: 'Kingdom Come: Deliverance II', genre: 'RPG', platforms: ['PC', 'PS5', 'Xbox'], price: 249.9, rating: 8.9, badge: 'Lançamento', steamAppId: 1771300, steamMovie: 257093751, youtube: 'Es5Y-evNed8' },
  { id: 'bannerlord', title: 'Mount & Blade II: Bannerlord', genre: 'Estratégia', platforms: ['PC'], price: 199.9, rating: 8.5, steamAppId: 261550, steamMovie: 256910718, youtube: 'A4OmrIPEvOM' },
  { id: 'ck3', title: 'Crusader Kings III', genre: 'Estratégia', platforms: ['PC', 'PS5', 'Xbox'], price: 179.9, rating: 8.7, steamAppId: 1158310, steamMovie: 257057629, youtube: 'd3iz2Ny0Ca8' },

  // ===== Ação =====
  { id: 'chivalry2', title: 'Chivalry 2', genre: 'Ação', platforms: ['PC', 'PS5', 'Xbox'], price: 129.9, rating: 8.0, steamAppId: 1824220, steamMovie: 257024592, youtube: 'mEKWQQHIBuc' },
  { id: 'dmc5', title: 'Devil May Cry 5', genre: 'Ação', platforms: ['PC', 'PS5', 'Xbox'], price: 199.9, rating: 9.0, steamAppId: 601150, steamMovie: 256814526, youtube: 'Z-S3cnZNiNs' },
  { id: 'sekiro', title: 'Sekiro: Shadows Die Twice', genre: 'Ação', platforms: ['PC', 'PS5', 'Xbox'], price: 199.9, rating: 9.3, steamAppId: 814380, steamMovie: 256806899, youtube: 'rXMX4YJ7Lks' },

  // ===== FPS / competitivo =====
  { id: 'doom-eternal', title: 'DOOM Eternal', genre: 'FPS', platforms: ['PC', 'PS5', 'Xbox'], price: 49.9, oldPrice: 149.9, rating: 9.1, steamAppId: 782330, steamMovie: 257182101, youtube: '_UuktemkCFI' },
  { id: 'cs2', title: 'Counter-Strike 2', genre: 'FPS', platforms: ['PC'], price: 0, rating: 8.0, steamAppId: 730, steamMovie: 256972298, youtube: 'c80dVYcL69E' },
  { id: 'r6', title: 'Rainbow Six Siege', genre: 'FPS', platforms: ['PC', 'PS5', 'Xbox'], price: 39.9, oldPrice: 99.9, rating: 8.3, steamAppId: 359550, steamMovie: 257154992, youtube: '6wlvYh0h63k' },
  { id: 'apex', title: 'Apex Legends', genre: 'FPS', platforms: ['PC', 'PS5', 'Xbox'], price: 0, rating: 8.1, steamAppId: 1172470, youtube: 'innmNewjkuk' },
  { id: 'dota2', title: 'Dota 2', genre: 'MOBA', platforms: ['PC'], price: 0, rating: 8.2, steamAppId: 570, steamMovie: 256692021, youtube: '-cSFPIwMEq4' },
  { id: 'rocket-league', title: 'Rocket League', genre: 'Esporte', platforms: ['PC', 'PS5', 'Xbox'], price: 0, rating: 8.6, steamAppId: 252950, youtube: 'AWk5o2zHfHU' },
  { id: 'sf6', title: 'Street Fighter 6', genre: 'Luta', platforms: ['PC', 'PS5', 'Xbox'], price: 249.9, rating: 8.8, steamAppId: 1364780, steamMovie: 257206554, youtube: '1Eke94y0fho' },

  // ===== Terror =====
  { id: 're-village', title: 'Resident Evil Village', genre: 'Terror', platforms: ['PC', 'PS5', 'Xbox'], price: 79.9, oldPrice: 199.9, rating: 8.9, steamAppId: 1196590, steamMovie: 256825272, youtube: 'A_C40iFCnyk' },
  { id: 're4-remake', title: 'Resident Evil 4', genre: 'Terror', platforms: ['PC', 'PS5', 'Xbox'], price: 249.9, rating: 9.4, steamAppId: 2050650, steamMovie: 256998128, youtube: 'AdW7iElGTuw' },
  { id: 'dead-space', title: 'Dead Space', genre: 'Terror', platforms: ['PC', 'PS5', 'Xbox'], price: 99.9, oldPrice: 249.9, rating: 8.9, steamAppId: 1693980, steamMovie: 256929315, youtube: 'wsd_b1_R72o' },
  { id: 'silent-hill-2', title: 'Silent Hill 2', genre: 'Terror', platforms: ['PC', 'PS5'], price: 249.9, rating: 9.0, badge: 'Lançamento', steamAppId: 2124490, steamMovie: 257063160, youtube: 'Narp_pPP9C0' },
  { id: 'alien-isolation', title: 'Alien: Isolation', genre: 'Terror', platforms: ['PC'], price: 79.9, rating: 8.7, steamAppId: 214490, steamMovie: 2033959, youtube: 'V4qj0YdN6KU' },
  { id: 'phasmophobia', title: 'Phasmophobia', genre: 'Terror', platforms: ['PC'], price: 49.9, rating: 8.5, steamAppId: 739630, steamMovie: 257162354, youtube: 'gTUe_NAytx4' },
  { id: 'dbd', title: 'Dead by Daylight', genre: 'Terror', platforms: ['PC', 'PS5', 'Xbox'], price: 29.9, oldPrice: 79.9, rating: 8.0, steamAppId: 381210, youtube: 'qWPbsbBz_-w' },

  // ===== Indie =====
  { id: 'hades', title: 'Hades', genre: 'Indie', platforms: ['PC'], price: 29.9, oldPrice: 69.9, rating: 9.3, steamAppId: 1145360, steamMovie: 256801252, youtube: 'Bz8l935Bv0Y' },
  { id: 'hollow-knight', title: 'Hollow Knight', genre: 'Indie', platforms: ['PC'], price: 14.9, oldPrice: 27.9, rating: 9.4, steamAppId: 367520, steamMovie: 256679401, youtube: 'UAO2urG23S4' },
  { id: 'stardew', title: 'Stardew Valley', genre: 'Indie', platforms: ['PC'], price: 34.9, rating: 9.6, steamAppId: 413150, steamMovie: 256815967, youtube: 'ot7uXNQskhs' },
  { id: 'celeste', title: 'Celeste', genre: 'Indie', platforms: ['PC'], price: 12.9, oldPrice: 36.9, rating: 9.2, steamAppId: 504230, steamMovie: 256706951, youtube: '70d9irlxiB4' },
  { id: 'cuphead', title: 'Cuphead', genre: 'Indie', platforms: ['PC'], price: 44.9, rating: 9.0, steamAppId: 268910, steamMovie: 256894191, youtube: 'NN-9SQXoi50' },
  { id: 'dead-cells', title: 'Dead Cells', genre: 'Indie', platforms: ['PC'], price: 27.9, rating: 9.1, steamAppId: 588650, steamMovie: 256755089, youtube: 'KW5fOWX0300' },
  { id: 'tunic', title: 'TUNIC', genre: 'Indie', platforms: ['PC', 'PS5', 'Xbox'], price: 74.9, rating: 8.8, steamAppId: 553420, steamMovie: 256863992, youtube: '-9Puf9aJZHE' },
  { id: 'deaths-door', title: "Death's Door", genre: 'Indie', platforms: ['PC', 'PS5', 'Xbox'], price: 29.9, oldPrice: 59.9, rating: 8.7, steamAppId: 894020, steamMovie: 256844444, youtube: '3JLqdTd1zZc' },
  { id: 'hyper-light', title: 'Hyper Light Drifter', genre: 'Indie', platforms: ['PC'], price: 19.9, oldPrice: 49.9, rating: 8.6, steamAppId: 257850, steamMovie: 256661723, youtube: 'bafkb0eVKZ4' },
  { id: 'blasphemous', title: 'Blasphemous', genre: 'Indie', platforms: ['PC'], price: 24.9, oldPrice: 54.9, rating: 8.4, steamAppId: 774361, steamMovie: 256761817, youtube: 'sAr82xVcViU' },
  { id: 'crosscode', title: 'CrossCode', genre: 'Indie', platforms: ['PC'], price: 64.9, rating: 8.5, steamAppId: 368340, steamMovie: 256668686, youtube: 'A5oMvF24EhM' },
  { id: 'moonlighter', title: 'Moonlighter', genre: 'Indie', platforms: ['PC'], price: 18.9, oldPrice: 44.9, rating: 8.0, steamAppId: 606150, steamMovie: 256892422, youtube: 'C03lTPaffjA' },
  { id: 'eastward', title: 'Eastward', genre: 'Indie', platforms: ['PC'], price: 39.9, oldPrice: 74.9, rating: 8.5, steamAppId: 977880, steamMovie: 256851826, youtube: 'algSDB52VPg' },
  { id: 'sea-of-stars', title: 'Sea of Stars', genre: 'Indie', platforms: ['PC', 'PS5', 'Xbox'], price: 99.9, rating: 8.9, steamAppId: 1244090, steamMovie: 256995688, youtube: 'i_oqWXEQjt0' },
];

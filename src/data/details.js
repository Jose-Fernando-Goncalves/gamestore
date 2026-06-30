// Conteúdo da página de detalhes do jogo. Os campos básicos (preço, nota,
// plataformas, capa) vêm do `catalog`; aqui ficam só os campos ricos da ficha:
// descrição, ficha técnica, destaques, requisitos e avaliações.
//
// `getGameDetails(id)` resolve um jogo do catálogo + sua ficha através do
// `make()`, que deriva a lista de mídia (trailer + artes do Steam) e preenche
// padrões sensatos para jogos sem ficha completa.

import { steamCapsule, steamHero, steamWide, ytThumb, steamTrailer } from './catalog';
import { STEAM } from './steam';

// Ficha editorial por jogo. Requisitos: cada nível é { so, cpu, ram, gpu, disco }.
const FICHAS = {
  'spiderman2': {
    descricao:
      'Peter Parker e Miles Morales enfrentam o teste definitivo de força — dentro e fora das máscaras — para salvar a cidade, uns aos outros e quem amam do simbionte e do letal Venom. Balance por uma Nova York maior, com troca instantânea entre os dois Aranhas.',
    desenvolvedora: 'Insomniac Games',
    distribuidora: 'PlayStation PC LLC',
    lancamento: '30 jan 2025',
    idiomas: ['Português (Brasil)', 'Inglês', 'Espanhol', '+14'],
    tags: ['Super-herói', 'Mundo Aberto', 'Ação', 'Aventura', 'História'],
    destaques: [
      { icon: 'Users', label: 'Dois Homens-Aranha jogáveis' },
      { icon: 'Globe', label: 'Nova York expandida' },
      { icon: 'Swords', label: 'Combate fluido e aéreo' },
      { icon: 'Camera', label: 'Modo foto avançado' },
    ],
    req: {
      min: { so: 'Windows 10', cpu: 'Core i3-8100', ram: '16 GB', gpu: 'GTX 1650', disco: '75 GB SSD' },
      rec: { so: 'Windows 10', cpu: 'Core i5-8400', ram: '16 GB', gpu: 'RTX 2070', disco: '75 GB SSD' },
    },
    avaliacao: { nota: 92, total: '38.412', rotulo: 'Muito positivas' },
  },
  'black-myth': {
    descricao:
      'Um RPG de ação inspirado em "Jornada ao Oeste", um dos quatro grandes clássicos da literatura chinesa. Encarne o Destinado e enfrente inimigos e deuses lendários numa jornada épica para desvendar a verdade por trás de um passado glorioso.',
    desenvolvedora: 'Game Science',
    distribuidora: 'Game Science',
    lancamento: '20 ago 2024',
    idiomas: ['Português (Brasil)', 'Inglês', 'Chinês', '+10'],
    tags: ['Action RPG', 'Soulslike', 'Mitologia', 'Single-player', 'Cinemático'],
    destaques: [
      { icon: 'Swords', label: 'Combate com bastão versátil' },
      { icon: 'Sparkles', label: '72 transformações' },
      { icon: 'Trophy', label: 'Chefes lendários' },
      { icon: 'Cpu', label: 'Visual em Unreal Engine 5' },
    ],
    req: {
      min: { so: 'Windows 10', cpu: 'Core i5-8400', ram: '16 GB', gpu: 'GTX 1060 6GB', disco: '130 GB SSD' },
      rec: { so: 'Windows 10/11', cpu: 'Core i7-9700', ram: '16 GB', gpu: 'RTX 2060', disco: '130 GB SSD' },
    },
    avaliacao: { nota: 96, total: '241.087', rotulo: 'Extremamente positivas' },
  },
  'cyberpunk': {
    descricao:
      'Um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e biomodificações. Jogue como V e persiga um implante único que é a chave para a imortalidade.',
    desenvolvedora: 'CD PROJEKT RED',
    distribuidora: 'CD PROJEKT RED',
    lancamento: '10 dez 2020',
    idiomas: ['Português (Brasil)', 'Inglês', 'Espanhol', '+17'],
    tags: ['Cyberpunk', 'Mundo Aberto', 'RPG', 'Ray Tracing', 'FPS'],
    destaques: [
      { icon: 'Globe', label: 'Night City viva e densa' },
      { icon: 'Cpu', label: 'Ray tracing e path tracing' },
      { icon: 'Sparkles', label: 'Builds e implantes' },
      { icon: 'GitBranch', label: 'Escolhas com consequências' },
    ],
    req: {
      min: { so: 'Windows 10', cpu: 'Core i5-3570K', ram: '8 GB', gpu: 'GTX 780', disco: '70 GB SSD' },
      rec: { so: 'Windows 10', cpu: 'Core i7-4790', ram: '12 GB', gpu: 'RTX 2060', disco: '70 GB SSD' },
    },
    avaliacao: { nota: 91, total: '712.940', rotulo: 'Muito positivas' },
  },
  'elden-ring': {
    descricao:
      'Erga-se, Maculado, e seja guiado pela graça para empunhar o poder do Anel Prestigioso e tornar-se um Senhor Prestigioso nas Terras Intermédias. Um vasto mundo de fantasia sombria criado por Hidetaka Miyazaki e George R. R. Martin, onde cada masmorra, chefe e segredo recompensa a coragem.',
    desenvolvedora: 'FromSoftware',
    distribuidora: 'Bandai Namco Entertainment',
    lancamento: '25 fev 2022',
    idiomas: ['Português (Brasil)', 'Inglês', 'Japonês', '+11'],
    tags: ['Souls-like', 'Mundo Aberto', 'RPG', 'Fantasia Sombria', 'Cooperativo'],
    destaques: [
      { icon: 'Globe', label: 'Mundo aberto interconectado' },
      { icon: 'Users', label: 'Co-op e PvP online' },
      { icon: 'Swords', label: 'Combate implacável' },
      { icon: 'Sparkles', label: 'Centenas de armas e feitiços' },
    ],
    req: {
      min: { so: 'Windows 10', cpu: 'Core i5-8400', ram: '12 GB', gpu: 'GTX 1060 3GB', disco: '60 GB' },
      rec: { so: 'Windows 10/11', cpu: 'Core i7-8700K', ram: '16 GB', gpu: 'GTX 1070 8GB', disco: '60 GB SSD' },
    },
    avaliacao: { nota: 96, total: '784.215', rotulo: 'Extremamente positivas' },
  },
  'gow-ragnarok': {
    descricao:
      'Embarque numa jornada épica e comovente enquanto Kratos e Atreus lutam para se manter unidos diante do Ragnarök iminente. Atravesse os Nove Reinos em busca de respostas, perseguidos pelos deuses de Asgard.',
    desenvolvedora: 'Santa Monica Studio',
    distribuidora: 'PlayStation PC LLC',
    lancamento: '19 set 2024',
    idiomas: ['Português (Brasil)', 'Inglês', 'Espanhol', '+15'],
    tags: ['Ação', 'Aventura', 'Mitologia Nórdica', 'História', 'Single-player'],
    destaques: [
      { icon: 'Globe', label: 'Os Nove Reinos' },
      { icon: 'Swords', label: 'Combate brutal com o Machado Leviatã' },
      { icon: 'Users', label: 'Jornada de pai e filho' },
      { icon: 'Trophy', label: 'Acessibilidade premiada' },
    ],
    req: {
      min: { so: 'Windows 10', cpu: 'Core i5-4670K', ram: '8 GB', gpu: 'GTX 1060', disco: '119 GB SSD' },
      rec: { so: 'Windows 10', cpu: 'Core i5-8600', ram: '16 GB', gpu: 'RTX 2060', disco: '119 GB SSD' },
    },
    avaliacao: { nota: 94, total: '96.530', rotulo: 'Muito positivas' },
  },
  'ff16': {
    descricao:
      'Uma fantasia sombria onde o destino de um mundo dilacerado pesa sobre os Portadores dos Cristais-Mãe. Acompanhe Clive Rosfield em sua jornada de vingança ao lado dos Eikons, invocações colossais que decidem o rumo das guerras.',
    desenvolvedora: 'Square Enix',
    distribuidora: 'Square Enix',
    lancamento: '17 set 2024',
    idiomas: ['Português (Brasil)', 'Inglês', 'Japonês', '+8'],
    tags: ['Action RPG', 'Fantasia', 'Cinemático', 'História', 'Single-player'],
    destaques: [
      { icon: 'Sparkles', label: 'Batalhas contra Eikons' },
      { icon: 'Swords', label: 'Combate de ação em tempo real' },
      { icon: 'Globe', label: 'O mundo de Valisthea' },
      { icon: 'Trophy', label: 'Trilha orquestrada' },
    ],
    req: {
      min: { so: 'Windows 10', cpu: 'Core i7-8700', ram: '16 GB', gpu: 'RTX 2060', disco: '170 GB SSD' },
      rec: { so: 'Windows 10', cpu: 'Core i7-10700', ram: '16 GB', gpu: 'RTX 2080', disco: '170 GB SSD' },
    },
    avaliacao: { nota: 88, total: '21.764', rotulo: 'Muito positivas' },
  },
  're-requiem': {
    descricao:
      'Oito anos após a tragédia de Raccoon City, a agente Grace Ashcroft é arrastada de volta ao horror enquanto investiga mortes inexplicáveis. O survival horror definitivo retorna na RE Engine, alternando entre o terror em primeira e em terceira pessoa.',
    desenvolvedora: 'Capcom',
    distribuidora: 'Capcom',
    lancamento: '26 fev 2026',
    idiomas: ['Português (Brasil)', 'Inglês', 'Japonês', '+10'],
    tags: ['Survival Horror', 'Terror', 'Single-player', 'RE Engine', 'Suspense'],
    destaques: [
      { icon: 'Cpu', label: 'Renderizado na RE Engine' },
      { icon: 'Camera', label: 'Terror em 1ª e 3ª pessoa' },
      { icon: 'Ghost', label: 'Atmosfera claustrofóbica' },
      { icon: 'Sparkles', label: 'Nova protagonista' },
    ],
    req: {
      min: { so: 'Windows 10', cpu: 'Core i5-10600', ram: '16 GB', gpu: 'RTX 2060', disco: '70 GB SSD' },
      rec: { so: 'Windows 11', cpu: 'Core i7-12700', ram: '16 GB', gpu: 'RTX 3070', disco: '70 GB SSD' },
    },
    avaliacao: null, // ainda não lançado
  },
  'gta6': {
    descricao:
      'Vice City renasce maior, mais vibrante e mais perigosa do que nunca. Acompanhe Lucia e seu parceiro pelos ensolarados e traiçoeiros estados de Leonida, num mundo aberto da nova geração da Rockstar.',
    desenvolvedora: 'Rockstar Games',
    distribuidora: 'Rockstar Games',
    lancamento: '2026',
    idiomas: ['Português (Brasil)', 'Inglês', 'Espanhol', '+12'],
    tags: ['Mundo Aberto', 'Ação', 'Aventura', 'Crime', 'Multiplayer'],
    destaques: [
      { icon: 'Globe', label: 'O estado de Leonida' },
      { icon: 'Users', label: 'Dois protagonistas' },
      { icon: 'Cpu', label: 'Mundo vivo de nova geração' },
      { icon: 'Trophy', label: 'Online expandido' },
    ],
    req: null, // requisitos a divulgar
    avaliacao: null,
  },
};

// Galeria: trailer primeiro, depois screenshots reais do Steam (se houver),
// caindo para as artes/capsule e por fim a thumb do trailer.
function makeMedia(g, steam) {
  // Pôster do trailer: imagem CONFIÁVEL do Steam primeiro. O maxresdefault do
  // YouTube (ytThumb) não existe para ~metade dos trailers e deixava o pôster
  // quebrado; library_hero/screenshots/capa são fontes garantidas.
  const posterTrailer =
    (g.steamAppId ? steamHero(g.steamAppId) : null) ||
    steam?.screenshots?.[0] ||
    g.cover ||
    ytThumb(g.youtube);

  // O trailer toca direto do Steam (movie480.mp4); sem `steamMovie` (jogo sem
  // appId acessível) cai no embed do YouTube.
  const media = [
    {
      type: 'video',
      id: g.youtube,
      movie: g.steamMovie ? steamTrailer(g.steamMovie) : null,
      thumb: posterTrailer,
    },
  ];
  if (steam?.screenshots?.length) {
    steam.screenshots.forEach((src) => media.push({ type: 'image', src }));
  } else if (g.steamAppId) {
    media.push({ type: 'image', src: steamHero(g.steamAppId) });
    media.push({ type: 'image', src: steamWide(g.steamAppId) });
    media.push({ type: 'image', src: steamCapsule(g.steamAppId) });
  } else {
    if (g.cover) media.push({ type: 'image', src: g.cover });
    media.push({ type: 'image', src: ytThumb(g.youtube) });
  }
  return media;
}

// Fontes do fundo do hero, em ordem de preferência (o componente troca no erro).
function heroSources(g, steam) {
  const list = [];
  if (g.steamAppId) list.push(steamHero(g.steamAppId));
  if (steam?.screenshots?.[0]) list.push(steam.screenshots[0]);
  if (g.cover) list.push(g.cover);
  list.push(ytThumb(g.youtube));
  return list;
}

// Recebe o objeto do jogo clicado (de qualquer seção) e funde: campos básicos
// do card + dados reais do Steam + ficha curada (que tem prioridade).
function make(g) {
  const steam = g.steamAppId ? STEAM[g.steamAppId] : null;
  const ficha = FICHAS[g.id] ?? {};
  const genre = g.genre || g.kind || steam?.generos?.[0] || 'Jogo';

  return {
    id: g.id,
    title: g.title,
    genre,
    youtube: g.youtube,
    platforms: g.platforms ?? ['PC'],
    accent: g.accent || '#d6ff3f',
    badge: g.badge ?? null,
    rating: g.rating ?? 0,
    price: g.price,
    oldPrice: g.oldPrice,
    discount: g.discount || 0,
    preVenda: g.badge === 'Pré-venda',

    heroSources: heroSources(g, steam),
    media: makeMedia(g, steam),

    descricao: ficha.descricao || steam?.descricao || '',
    desenvolvedora: ficha.desenvolvedora || steam?.desenvolvedora || '—',
    distribuidora: ficha.distribuidora || steam?.distribuidora || '—',
    lancamento: ficha.lancamento || steam?.lancamento || '—',
    idiomas: ficha.idiomas?.join(', ') || steam?.idiomas || null,
    tags: ficha.tags || steam?.generos || [genre],
    destaques: ficha.destaques ?? [],
    req: steam?.reqMin
      ? { min: steam.reqMin, rec: steam.reqRec }
      : ficha.req ?? null,
    avaliacao:
      ficha.avaliacao ||
      (steam?.metacritic
        ? { nota: steam.metacritic, rotulo: 'Metacritic', total: null }
        : null),
  };
}

export function getGameDetails(game) {
  if (!game) return null;
  return make(game);
}

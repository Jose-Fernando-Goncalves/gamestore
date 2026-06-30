// Comentários fictícios determinísticos por jogo. A seed vem do id do jogo,
// então cada jogo sempre exibe o mesmo conjunto (estável entre renders), mas
// jogos diferentes recebem combinações diferentes de autor, nota, data e texto.
// Alguns modelos referenciam {genre}/{title}/{studio} para soar específicos.

const AUTORES = [
  'NeoxBR', 'LaraDoCerrado', 'mago_do_loot', 'JotaPlays', 'Renata.exe',
  'ZéDoControle', 'pixel_kira', 'BrunoHeadshot', 'aurora_gamer', 'TioPatinhas77',
  'vovó_gamer', 'KaduNoScope', 'Mari_Speedrun', 'DiegoRespawn', 'luna_noturna',
  'o_ferreira', 'Tatá_Combo', 'RogerThunder', 'bia_critica', 'GuiNoob2007',
  'Marcão_Hardcore', 'Nina_Lore', 'feliperush', 'Cacá_Casual', 'VitinPro',
  'dani_loot', 'Thiago99fps', 'manu_play', 'RafaBoss', 'seu_jorge_games',
];

const CORES = [
  '#ff5a36', '#38bdf8', '#d6ff3f', '#f0b450', '#ff5aa8',
  '#a78bfa', '#34d399', '#fb7185', '#22d3ee', '#facc15',
];

// nota = 1..5 estrelas
const MODELOS = [
  { nota: 5, texto: 'Um dos melhores jogos de {genre} que joguei nos últimos anos. Cada hora investida valeu a pena.' },
  { nota: 5, texto: 'Ambientação e direção de arte impecáveis. A {studio} entregou uma obra muito bem acabada.' },
  { nota: 5, texto: 'Narrativa madura, personagens memoráveis e um desfecho que me marcou de verdade.' },
  { nota: 5, texto: 'Gameplay envolvente do começo ao fim. Já comecei um segundo playthrough.' },
  { nota: 5, texto: 'Roda muito bem otimizado no PC e o nível de detalhe impressiona em todas as cenas.' },
  { nota: 5, texto: 'Trilha sonora excepcional, acompanha cada momento na medida certa.' },
  { nota: 5, texto: 'Sistema de progressão bem equilibrado: sempre há algo novo pra desbloquear.' },
  { nota: 5, texto: 'Acessibilidade muito bem pensada e opções de configuração completas. Ponto pra {studio}.' },
  { nota: 4, texto: 'Experiência sólida e polida. Perde meio ponto por alguns problemas de câmera.' },
  { nota: 4, texto: 'História envolvente e mundo rico em detalhes. O ritmo cai um pouco no meio, mas se recupera.' },
  { nota: 4, texto: 'Ótimo custo-benefício, ainda mais em promoção. Recomendo sem pensar duas vezes.' },
  { nota: 4, texto: 'Combate fluido e recompensador. Faltou só um pouco mais de variedade de inimigos.' },
  { nota: 4, texto: 'Muito bom, mas ainda precisa de alguns patches de otimização em placas mais antigas.' },
  { nota: 4, texto: 'Dublagem e localização em português caprichadas, fez toda a diferença pra mim.' },
  { nota: 4, texto: 'Conteúdo de sobra para dezenas de horas. {title} rende bastante pelo preço.' },
  { nota: 3, texto: 'Começa muito bem, mas perde o fôlego na reta final. Ainda assim, vale a experiência.' },
  { nota: 3, texto: 'Tem ideias interessantes, porém a execução deixa a desejar em alguns sistemas.' },
  { nota: 3, texto: 'Esperava um pouco mais pelo hype, mas entrega o que promete sem grandes surpresas.' },
  { nota: 3, texto: 'Bom jogo no geral, só achei os menus e a interface pouco intuitivos.' },
  { nota: 3, texto: 'Boa pedida pra quem curte o gênero, mas não traz nada de muito novo.' },
  { nota: 2, texto: 'Bom conceito, execução irregular. Recomendo esperar uma promoção e mais patches.' },
  { nota: 2, texto: 'Enfrentei vários bugs e quedas de desempenho que atrapalharam a experiência.' },
  { nota: 2, texto: 'A repetição começa a pesar depois de algumas horas. Faltou variedade de conteúdo.' },
  { nota: 2, texto: 'Tem potencial, mas foi lançado cedo demais. Precisa amadurecer com atualizações.' },
  { nota: 1, texto: 'Não correspondeu às minhas expectativas. Acabei desistindo antes de terminar.' },
  { nota: 1, texto: 'Problemas técnicos demais na minha máquina. Experiência frustrante do começo ao fim.' },
];

const DATAS = [
  'há 2 horas', 'ontem', 'há 3 dias', 'há 5 dias', 'há 1 semana',
  'há 2 semanas', 'há 3 semanas', 'há 1 mês', 'há 2 meses',
];

// FNV-1a → inteiro estável a partir de uma string.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// PRNG determinístico (mulberry32).
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Embaralha índices 0..n-1 com o rng e retorna os `count` primeiros.
function escolher(rng, n, count) {
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, count);
}

export function getComments(game) {
  const rng = mulberry32(hash(game.id || game.title || 'jogo'));
  const count = 4 + Math.floor(rng() * 3); // 4..6 comentários
  const ai = escolher(rng, AUTORES.length, count);
  const mi = escolher(rng, MODELOS.length, count);
  const di = escolher(rng, DATAS.length, count).sort((a, b) => a - b); // recente → antigo

  const studio =
    game.desenvolvedora && game.desenvolvedora !== '—'
      ? game.desenvolvedora
      : 'os desenvolvedores';
  const sub = (s) =>
    s
      .replace('{genre}', game.genre || 'jogo')
      .replace('{title}', game.title || 'o jogo')
      .replace('{studio}', studio);

  return ai.map((a, k) => {
    const m = MODELOS[mi[k]];
    const plats = game.platforms && game.platforms.length ? game.platforms : ['PC'];
    return {
      id: `${game.id || 'g'}-${k}`,
      autor: AUTORES[a],
      cor: CORES[(a + k) % CORES.length],
      nota: m.nota,
      texto: sub(m.texto),
      quando: DATAS[di[k]],
      curtidas: Math.floor(rng() * 420),
      plataforma: plats[Math.floor(rng() * plats.length)],
      recomenda: m.nota >= 4,
    };
  });
}

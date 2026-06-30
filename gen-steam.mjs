// Gerador descartável: coleta todos os steamAppId usados no site e baixa da
// API pública appdetails (cc=br&l=portuguese) screenshots reais, descrição,
// dev/distribuidora, gêneros, requisitos e Metacritic. Grava src/data/steam.js.
import { readFileSync, writeFileSync } from 'node:fs';

// Coleta todos os steamAppId citados nos módulos de dados (regex evita ter de
// importar ESM com paths sem extensão que o Node não resolve).
const ids = new Set();
for (const f of ['catalog', 'deals', 'topics', 'retro']) {
  const src = readFileSync(`./src/data/${f}.js`, 'utf8');
  for (const m of src.matchAll(/steamAppId:\s*(\d+)/g)) ids.add(Number(m[1]));
}

const strip = (html = '') =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Converte o HTML de requisitos do Steam (lista <li><strong>Label:</strong> valor)
// em campos estruturados { so, cpu, ram, gpu, disco }.
function parseReq(html) {
  if (!html) return null;
  const map = {};
  for (const m of html.matchAll(/<li>(.*?)<\/li>/gis)) {
    const t = strip(m[1]);
    const i = t.indexOf(':');
    if (i < 0) continue;
    map[t.slice(0, i).trim().toLowerCase()] = t.slice(i + 1).trim();
  }
  const pick = (...keys) => {
    for (const k of keys)
      for (const lbl in map) if (lbl.includes(k)) return map[lbl];
    return null;
  };
  const req = {
    so: pick('sistema oper', 'so '),
    cpu: pick('processador'),
    ram: pick('memória', 'memoria'),
    gpu: pick('placa gráfica', 'placa de vídeo', 'placa de video', 'gráfica', 'grafica'),
    disco: pick('espaço', 'armazenamento', 'disco'),
  };
  return Object.values(req).some(Boolean) ? req : null;
}

const out = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const id of ids) {
  try {
    const r = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${id}&cc=br&l=portuguese`,
      { headers: { 'Accept-Language': 'pt-BR' } }
    );
    const j = await r.json();
    const d = j[id];
    if (!d?.success) {
      console.log('skip', id);
      await sleep(200);
      continue;
    }
    const data = d.data;
    out[id] = {
      descricao: data.short_description || '',
      screenshots: (data.screenshots || []).slice(0, 8).map((s) => s.path_full),
      desenvolvedora: (data.developers || [])[0] || '',
      distribuidora: (data.publishers || [])[0] || '',
      lancamento: data.release_date?.date || '',
      generos: (data.genres || []).map((g) => g.description),
      idiomas: strip(data.supported_languages).replace(/\s*\*.*$/, '').trim() || null,
      metacritic: data.metacritic?.score || null,
      reqMin: parseReq(data.pc_requirements?.minimum),
      reqRec: parseReq(data.pc_requirements?.recommended),
    };
    console.log('ok', id, out[id].screenshots.length, 'screens');
  } catch (e) {
    console.log('err', id, e.message);
  }
  await sleep(250); // educado com a API
}

const banner =
  '// Dados reais gerados de store.steampowered.com/api/appdetails (cc=br&l=portuguese).\n' +
  '// Screenshots, descrição, dev/distribuidora, gêneros, requisitos e Metacritic\n' +
  '// de cada jogo, indexados por steamAppId. Regenerar com `node gen-steam.mjs`.\n';
writeFileSync(
  'src/data/steam.js',
  `${banner}export const STEAM = ${JSON.stringify(out, null, 2)};\n`
);
console.log('\nGravado src/data/steam.js —', Object.keys(out).length, 'jogos');

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Tag, X, Gamepad2 } from 'lucide-react';
import { getAllGames } from '../data/gameStore';
import { genreFacets } from '../data/library';
import GameCard from '../components/GameCard';

const ORDENACOES = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
  { id: 'avaliacao', label: 'Mais bem avaliados' },
  { id: 'nome', label: 'Nome (A–Z)' },
];

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const [games, setGames] = useState(null); // null = carregando
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('relevancia');

  // Gênero e "só promoções" vivem na URL (?genero=… / ?promo=1) — fonte única de
  // verdade, o que permite links diretos da home e do rodapé.
  const genero = params.get('genero') || 'Todos';
  const setGenero = (gen) => {
    const next = new URLSearchParams(params);
    if (gen === 'Todos') next.delete('genero');
    else next.set('genero', gen);
    setParams(next, { replace: true });
  };

  const soOferta = params.get('promo') === '1';
  const setSoOferta = (on) => {
    const next = new URLSearchParams(params);
    if (on) next.set('promo', '1');
    else next.delete('promo');
    setParams(next, { replace: true });
  };

  // Carrega a lista completa (biblioteca de fábrica + jogos do usuário) do
  // armazenamento assíncrono.
  useEffect(() => {
    let vivo = true;
    getAllGames().then((lista) => vivo && setGames(lista));
    return () => {
      vivo = false;
    };
  }, []);

  const facetas = useMemo(
    () => (games ? genreFacets(games) : []),
    [games]
  );

  const lista = useMemo(() => {
    if (!games) return [];
    const termo = busca.trim().toLowerCase();
    let r = games.filter((g) => {
      if (genero !== 'Todos' && g.genre !== genero) return false;
      if (soOferta && !(g.discount > 0)) return false;
      if (termo && !g.title.toLowerCase().includes(termo)) return false;
      return true;
    });

    const ordenar = {
      'menor-preco': (a, b) => a.price - b.price,
      'maior-preco': (a, b) => b.price - a.price,
      avaliacao: (a, b) => b.rating - a.rating,
      nome: (a, b) => a.title.localeCompare(b.title),
    }[ordem];
    if (ordenar) r = [...r].sort(ordenar);
    return r;
  }, [games, genero, soOferta, busca, ordem]);

  const carregando = games === null;
  const limpar = () => {
    setBusca('');
    setOrdem('relevancia');
    setParams({}, { replace: true }); // limpa genero e promo de uma vez
  };

  return (
    <div className="min-h-screen bg-ink-900 pt-[68px]">
      {/* ===== Cabeçalho ===== */}
      <header className="border-b border-white/10 bg-ink-800">
        <div className="mx-auto max-w-[1500px] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
            // Catálogo completo
          </span>
          <h1 className="mt-3 flex items-center gap-3 font-display text-4xl font-black tracking-tightest text-white sm:text-5xl lg:text-6xl">
            <Gamepad2 size={40} className="text-acid" /> Todos os jogos
          </h1>
          <p className="mt-4 max-w-xl font-body text-sm text-chrome">
            Explore a biblioteca inteira da HALLOW e filtre por gênero, preço e
            promoções para achar sua próxima jornada.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-6 py-10 sm:px-10 lg:px-16">
        {/* ===== Barra de ferramentas ===== */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Busca */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por título…"
              className="w-full border border-white/15 bg-ink-700 py-3 pl-11 pr-10 font-body text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-acid/60"
            />
            {busca && (
              <button
                onClick={() => setBusca('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Só promoções */}
            <button
              onClick={() => setSoOferta((v) => !v)}
              className={`flex items-center gap-2 border px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
                soOferta
                  ? 'border-acid bg-acid text-ink-900'
                  : 'border-white/15 text-white/65 hover:border-white/40 hover:text-white'
              }`}
            >
              <Tag size={14} /> Só promoções
            </button>

            {/* Ordenação */}
            <label className="flex items-center gap-2 border border-white/15 bg-ink-700 px-4 py-3 font-mono text-xs uppercase tracking-wider text-white/65">
              Ordenar
              <select
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
                className="bg-ink-700 font-mono text-xs uppercase tracking-wider text-acid outline-none"
              >
                {ORDENACOES.map((o) => (
                  <option key={o.id} value={o.id} className="bg-ink-700 text-white">
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* ===== Chips de gênero ===== */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip
            ativo={genero === 'Todos'}
            onClick={() => setGenero('Todos')}
            label="Todos"
            count={games?.length}
          />
          {facetas.map((f) => (
            <Chip
              key={f.name}
              ativo={genero === f.name}
              onClick={() => setGenero(f.name)}
              label={f.name}
              count={f.count}
            />
          ))}
        </div>

        {/* ===== Resultados ===== */}
        <div className="mt-8 flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-white/45">
            {carregando
              ? 'Carregando…'
              : `${lista.length} ${lista.length === 1 ? 'jogo' : 'jogos'}`}
          </span>
          {(genero !== 'Todos' || soOferta || busca) && !carregando && (
            <button
              onClick={limpar}
              className="font-mono text-xs uppercase tracking-widest text-acid hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {carregando ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[460/215] animate-pulse border border-white/10 bg-ink-700"
              />
            ))}
          </div>
        ) : lista.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {lista.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <Gamepad2 size={40} className="text-white/20" />
            <p className="font-mono text-sm text-chrome">
              Nenhum jogo encontrado com esses filtros.
            </p>
            <button
              onClick={limpar}
              className="clip-btn bg-acid px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-ink-900"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ ativo, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ${
        ativo
          ? 'border-acid bg-acid text-ink-900'
          : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
      }`}
    >
      {label}
      {count != null && (
        <span className={ativo ? 'text-ink-900/60' : 'text-white/30'}>{count}</span>
      )}
    </button>
  );
}

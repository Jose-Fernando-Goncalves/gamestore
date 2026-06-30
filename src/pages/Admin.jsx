import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  ArrowLeft,
  AlertCircle,
  Gamepad2,
  Tag,
  Gift,
  Star,
} from 'lucide-react';
import { listGames, createGame, updateGame, deleteGame } from '../data/api';
import { normalizeGame } from '../data/library';
import { coverSources } from '../data/catalog';
import { fmtBRL } from '../data/games';

const PLATAFORMAS = ['PC', 'PS5', 'Xbox'];

export default function Admin() {
  const [games, setGames] = useState(null);
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(undefined); // undefined=fechado, null=novo, obj=edição
  const [erro, setErro] = useState('');

  const carregar = () =>
    listGames()
      .then(setGames)
      .catch(() => setGames([]));

  useEffect(() => {
    carregar();
  }, []);

  const lista = useMemo(() => {
    if (!games) return [];
    const t = busca.trim().toLowerCase();
    return t ? games.filter((g) => g.title.toLowerCase().includes(t)) : games;
  }, [games, busca]);

  // Métricas do catálogo para a faixa de resumo do dashboard.
  const metrics = useMemo(() => {
    if (!games || games.length === 0) {
      return { total: 0, promo: 0, gratis: 0, nota: '—' };
    }
    const promo = games.filter((g) => g.oldPrice && g.oldPrice > g.price).length;
    const gratis = games.filter((g) => g.price === 0).length;
    const avaliados = games.filter((g) => g.rating > 0);
    const nota = avaliados.length
      ? (avaliados.reduce((s, g) => s + g.rating, 0) / avaliados.length).toFixed(1)
      : '—';
    return { total: games.length, promo, gratis, nota };
  }, [games]);

  const salvar = async (dados, id) => {
    setErro('');
    try {
      if (id) await updateGame(id, dados);
      else await createGame(dados);
      setEditando(undefined);
      await carregar();
    } catch (err) {
      setErro(err.message || 'Erro ao salvar.');
    }
  };

  const remover = async (g) => {
    if (!window.confirm(`Remover "${g.title}" do catálogo?`)) return;
    setErro('');
    try {
      await deleteGame(g.id);
      await carregar();
    } catch (err) {
      setErro(err.message || 'Erro ao remover.');
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 pt-[68px]">
      <header className="border-b border-white/10 bg-ink-800">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-6 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 lg:px-16">
          <div>
            <Link
              to="/conta"
              className="mb-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-white/45 hover:text-acid"
            >
              <ArrowLeft size={13} /> Voltar à conta
            </Link>
            <h1 className="flex items-center gap-3 font-display text-3xl font-black tracking-tightest text-white sm:text-4xl">
              <ShieldCheck size={32} className="text-acid" /> Painel admin
            </h1>
            <p className="mt-2 font-mono text-xs text-white/45">
              {games ? `${games.length} jogos no catálogo` : 'Carregando…'}
            </p>
          </div>
          <button
            onClick={() => setEditando(null)}
            className="clip-btn flex items-center justify-center gap-2 bg-acid px-5 py-3 font-display text-xs font-bold uppercase tracking-wide text-ink-900 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Plus size={16} /> Novo jogo
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-6 py-8 sm:px-10 lg:px-16">
        {erro && (
          <div className="mb-5 flex items-center gap-2 border border-signal/40 bg-signal/10 px-3 py-2.5 font-mono text-xs text-signal">
            <AlertCircle size={15} /> {erro}
          </div>
        )}

        {/* Faixa de métricas */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric icon={Gamepad2} rotulo="Jogos no catálogo" valor={metrics.total} accent="#d6ff3f" />
          <Metric icon={Tag} rotulo="Em promoção" valor={metrics.promo} accent="#38bdf8" />
          <Metric icon={Gift} rotulo="Gratuitos" valor={metrics.gratis} accent="#34d399" />
          <Metric icon={Star} rotulo="Nota média" valor={metrics.nota} accent="#f0b450" />
        </div>

        {/* Busca */}
        <div className="relative mb-6 w-full max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar jogo…"
            className="w-full border border-white/15 bg-ink-700 py-2.5 pl-11 pr-4 font-body text-sm text-white placeholder-white/35 outline-none focus:border-acid/60"
          />
        </div>

        {/* Tabela */}
        <div className="mb-3 flex items-center gap-3">
          <span className="h-3 w-1 bg-acid" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Catálogo
          </h2>
          {games && (
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
              {lista.length} {lista.length === 1 ? 'resultado' : 'resultados'}
            </span>
          )}
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-ink-800 text-left font-mono text-[11px] uppercase tracking-wider text-white/45">
                <th className="px-4 py-3 font-medium">Jogo</th>
                <th className="px-4 py-3 font-medium">Gênero</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Nota</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((g) => {
                const cover = coverSources(normalizeGame(g))[0];
                return (
                  <tr
                    key={g.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="aspect-[460/215] w-16 shrink-0 overflow-hidden bg-ink-700">
                          <img
                            src={cover}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-display text-sm font-bold text-white">
                            {g.title}
                          </div>
                          <div className="font-mono text-[10px] text-white/35">{g.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/60">{g.genre}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white">
                      {g.price === 0 ? 'Gratuito' : fmtBRL(g.price)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/70">
                      {g.rating > 0 ? g.rating.toFixed(1) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditando(g)}
                          aria-label={`Editar ${g.title}`}
                          className="flex h-8 w-8 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-acid hover:text-acid"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => remover(g)}
                          aria-label={`Remover ${g.title}`}
                          className="flex h-8 w-8 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-signal hover:text-signal"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!games &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`sk-${i}`} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="aspect-[460/215] w-16 shrink-0 animate-pulse bg-ink-700" />
                        <div className="h-3 w-32 animate-pulse bg-ink-700" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-3 w-16 animate-pulse bg-ink-700" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-12 animate-pulse bg-ink-700" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-8 animate-pulse bg-ink-700" /></td>
                    <td className="px-4 py-3"><div className="ml-auto h-3 w-16 animate-pulse bg-ink-700" /></td>
                  </tr>
                ))}
              {games && lista.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center font-mono text-sm text-chrome">
                    Nenhum jogo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editando !== undefined && (
        <GameForm
          jogo={editando}
          onCancel={() => setEditando(undefined)}
          onSave={salvar}
        />
      )}
    </div>
  );
}

// ---- Formulário (modal) de criação/edição ---------------------------------

function GameForm({ jogo, onCancel, onSave }) {
  const ehEdicao = !!jogo;
  const [f, setF] = useState(() => ({
    id: jogo?.id || '',
    title: jogo?.title || '',
    genre: jogo?.genre || '',
    price: jogo?.price ?? '',
    oldPrice: jogo?.oldPrice ?? '',
    rating: jogo?.rating ?? '',
    platforms: jogo?.platforms?.length ? jogo.platforms : ['PC'],
    steamAppId: jogo?.steamAppId ?? '',
    steamMovie: jogo?.steamMovie ?? '',
    youtube: jogo?.youtube ?? '',
    cover: jogo?.cover ?? '',
    badge: jogo?.badge ?? '',
    accent: jogo?.accent ?? '',
  }));
  const [salvando, setSalvando] = useState(false);

  const set = (k) => (v) => setF((cur) => ({ ...cur, [k]: v }));
  const togglePlat = (p) =>
    setF((cur) => ({
      ...cur,
      platforms: cur.platforms.includes(p)
        ? cur.platforms.filter((x) => x !== p)
        : [...cur.platforms, p],
    }));

  const enviar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    // Remove o id do corpo na edição (vai pela URL); mantém na criação se houver.
    const { id, ...resto } = f;
    const corpo = ehEdicao ? resto : { ...resto, id: id || undefined };
    await onSave(corpo, ehEdicao ? jogo.id : undefined);
    setSalvando(false);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-ink-900/80 p-4 backdrop-blur-sm sm:p-8">
      <div className="my-auto w-full max-w-2xl border border-white/10 bg-ink-800 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
            {ehEdicao ? 'Editar jogo' : 'Novo jogo'}
          </h2>
          <button
            onClick={onCancel}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-signal hover:text-signal"
          >
            <X size={16} />
          </button>
        </header>

        <form onSubmit={enviar} className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <Input label="Título *" value={f.title} onChange={set('title')} required full />
          {!ehEdicao && (
            <Input
              label="ID (slug — opcional)"
              value={f.id}
              onChange={set('id')}
              placeholder="ex.: elden-ring (gerado do título se vazio)"
              full
            />
          )}
          <Input label="Gênero" value={f.genre} onChange={set('genre')} placeholder="Ação, RPG…" />
          <Input label="Selo (badge)" value={f.badge} onChange={set('badge')} placeholder="Promoção, Lançamento…" />
          <Input label="Preço (R$)" type="number" step="0.01" value={f.price} onChange={set('price')} />
          <Input label="Preço antigo (R$)" type="number" step="0.01" value={f.oldPrice} onChange={set('oldPrice')} placeholder="só se em promoção" />
          <Input label="Nota (0–10)" type="number" step="0.1" value={f.rating} onChange={set('rating')} />
          <Input label="Cor de acento (hex)" value={f.accent} onChange={set('accent')} placeholder="#d6ff3f" />

          {/* Plataformas */}
          <div className="sm:col-span-2">
            <Rotulo>Plataformas</Rotulo>
            <div className="flex gap-2">
              {PLATAFORMAS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlat(p)}
                  className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    f.platforms.includes(p)
                      ? 'border-acid bg-acid text-ink-900'
                      : 'border-white/15 text-white/55 hover:border-white/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Input label="Steam App ID" type="number" value={f.steamAppId} onChange={set('steamAppId')} placeholder="capa oficial vem daqui" />
          <Input label="Steam Movie ID" type="number" value={f.steamMovie} onChange={set('steamMovie')} placeholder="trailer (≠ App ID)" />
          <Input label="YouTube ID" value={f.youtube} onChange={set('youtube')} placeholder="ex.: E3Huy2cdih0" />
          <Input label="URL da capa" value={f.cover} onChange={set('cover')} placeholder="se não usar Steam App ID" />

          <div className="mt-2 flex items-center justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onCancel}
              className="border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || !f.title}
              className="clip-btn flex items-center gap-2 bg-acid px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-ink-900 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <Save size={15} /> {salvando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Card de métrica do topo do dashboard.
function Metric({ icon: Icone, rotulo, valor, accent }) {
  return (
    <div
      className="group relative overflow-hidden border border-white/10 bg-ink-800 p-5 transition-colors hover:border-white/20"
      style={{ '--m': accent }}
    >
      {/* Brilho sutil da cor do card */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: accent }}
      />
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center border border-white/10"
          style={{ background: `${accent}1a`, color: accent }}
        >
          <Icone size={17} />
        </span>
        <span className="font-mono text-[10px] uppercase leading-tight tracking-wider text-white/45">
          {rotulo}
        </span>
      </div>
      <div className="mt-3 font-display text-3xl font-black tracking-tight text-white">
        {valor}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, step, required, full }) {
  return (
    <label className={full ? 'sm:col-span-2' : undefined}>
      <Rotulo>{label}</Rotulo>
      <input
        type={type}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-white/15 bg-ink-700 px-3 py-2.5 font-body text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-acid/60"
      />
    </label>
  );
}

function Rotulo({ children }) {
  return (
    <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-white/45">
      {children}
    </span>
  );
}

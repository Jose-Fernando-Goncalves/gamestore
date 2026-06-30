import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Play,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Users,
  Globe,
  Swords,
  Camera,
  Sparkles,
  Trophy,
  Cpu,
  GitBranch,
  Ghost,
  Monitor,
  MemoryStick,
  HardDrive,
  MonitorPlay,
  Languages,
  Building2,
  Calendar,
  Tag,
  ThumbsUp,
  Send,
  Trash2,
} from 'lucide-react';
import { useGameDetails } from '../context/GameDetailsContext';
import { getGameDetails } from '../data/details';
import { getComments } from '../data/comments';
import { ytThumb } from '../data/catalog';
import { fmtBRL } from '../data/games';

// Ícones dos "destaques" resolvidos por nome (vindo dos dados).
const ICONES = {
  Users, Globe, Swords, Camera, Sparkles, Trophy, Cpu, GitBranch, Ghost,
};

// Página de detalhes em overlay full-screen. Renderizada uma única vez no App;
// observa o id selecionado no contexto e sobe sobre a home.
export default function Cart() {
  const { jogo, fechar } = useGameDetails();
  const game = getGameDetails(jogo);

  // Trava o scroll do body e fecha no Esc enquanto o overlay está aberto.
  useEffect(() => {
    if (!game) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [game, fechar]);

  if (!game) return null;
  return <Painel key={game.id} game={game} fechar={fechar} />;
}

function Painel({ game, fechar }) {
  const [montado, setMontado] = useState(false);
  const [ativo, setAtivo] = useState(0); // índice da mídia ativa (0 = trailer)
  const [tocando, setTocando] = useState(false); // trailer rodando no visor
  const [heroIdx, setHeroIdx] = useState(0); // fallback do fundo do hero
  const galeriaRef = useRef(null);
  const heroSrc = game.heroSources[heroIdx];

  // Anima a entrada no primeiro frame após montar.
  useEffect(() => {
    const r = requestAnimationFrame(() => setMontado(true));
    return () => cancelAnimationFrame(r);
  }, []);

  // Galeria automática: enquanto NÃO estiver no trailer, passa para a próxima
  // screenshot a cada 2s (ciclando só entre as imagens, pulando o vídeo).
  useEffect(() => {
    if (game.media[ativo]?.type === 'video') return undefined;
    const t = setInterval(() => {
      setAtivo((cur) => {
        let next = cur + 1;
        if (next >= game.media.length)
          next = game.media.findIndex((m) => m.type === 'image');
        return next < 0 ? cur : next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [ativo, game.media]);

  const verTrailer = () => {
    setAtivo(0);
    setTocando(true);
    galeriaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const emOferta = game.discount > 0;
  const acento = game.accent || '#d6ff3f';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes — ${game.title}`}
      style={{ '--accent': acento }}
      className={`gd-scroll fixed inset-0 z-[80] overflow-y-auto overflow-x-hidden bg-ink-900 transition-all duration-500 ${montado ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
    >
      <ScopedStyles />
      {/* Atmosfera — sempre ATRÁS do conteúdo (z-0), bem sutil */}
      <div className="scanlines pointer-events-none fixed inset-0 z-0 opacity-[0.5]" />

      {/* ===== Barra de controle ===== */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-[1500px] items-center justify-between px-6 sm:px-10 lg:px-16">
          <button
            onClick={fechar}
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-acid"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Voltar à loja
          </button>
          <nav className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/40 sm:flex">
            <span>Loja</span>
            <span className="text-white/20">/</span>
            <span>{game.genre}</span>
            <span className="text-white/20">/</span>
            <span className="text-acid">{game.title}</span>
          </nav>
          <div className="flex items-center gap-1.5">
            <IconBtn label="Compartilhar"><Share2 size={16} /></IconBtn>
            <IconBtn label="Lista de desejos"><Heart size={16} /></IconBtn>
            <button
              onClick={fechar}
              aria-label="Fechar"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-signal hover:text-signal"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ===== Hero cinemático ===== */}
      <section className="relative z-[2] h-[58svh] min-h-[420px] w-full overflow-hidden">
        {heroSrc ? (
          <img
            src={heroSrc}
            alt=""
            onError={() => setHeroIdx((i) => i + 1)}
            className="absolute inset-0 h-full w-full animate-ken-burns object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(120% 120% at 30% 10%, ${acento}33, #07070a 70%)` }}
          />
        )}
        {/* Brilho da cor do jogo */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(90% 70% at 18% 25%, ${acento}22, transparent 60%)` }}
        />
        {/* Topo: a imagem dissolve sob a barra de controle */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-900/95 to-transparent" />
        {/* Esquerda: legibilidade do título */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/10 to-transparent" />
        {/* Base: fade longo e suave que funde o hero no corpo (sem linha dura) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink-900 via-ink-900/80 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-6 pb-9 sm:px-10 lg:px-16">
          <div className="flex items-center gap-2">
            {game.badge && (
              <span className="clip-btn bg-acid px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-900">
                {game.badge}
              </span>
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
              {game.genre}
            </span>
          </div>

          <h1 className="gd-rise mt-3 max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-tightest text-white sm:text-5xl lg:text-6xl">
            {game.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wider text-white/55">
            <span className="flex items-center gap-1.5">
              <Building2 size={13} /> {game.desenvolvedora}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> {game.lancamento}
            </span>
            {game.rating > 0 && (
              <span className="flex items-center gap-1.5 text-white/80">
                <Star size={13} className="fill-acid text-acid" /> {game.rating.toFixed(1)}
              </span>
            )}
            <span className="flex flex-wrap gap-1.5">
              {game.platforms.map((p) => (
                <span key={p} className="border border-white/20 px-1.5 py-0.5 text-[9px] text-white/60">
                  {p}
                </span>
              ))}
            </span>
          </div>

          <button
            onClick={verTrailer}
            className="group mt-6 flex w-fit items-center gap-3 border border-white/20 bg-ink-900/40 py-2 pl-2 pr-5 backdrop-blur transition-colors hover:border-acid"
          >
            <span className="flex h-9 w-9 items-center justify-center bg-acid text-ink-900 transition-transform group-hover:scale-110">
              <Play size={15} className="ml-0.5 fill-ink-900" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-white group-hover:text-acid">
              Assistir trailer
            </span>
          </button>
        </div>
      </section>

      {/* ===== Corpo ===== */}
      <div className="relative z-[2] mx-auto grid max-w-[1500px] grid-cols-1 gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_360px] lg:gap-12 lg:px-16">
        {/* ----- Coluna principal ----- */}
        <main className="min-w-0">
          {/* Galeria */}
          <div ref={galeriaRef} className="gd-rise scroll-mt-20">
            <Visor game={game} ativo={ativo} tocando={tocando} setTocando={setTocando} />
            <Miniaturas
              game={game}
              ativo={ativo}
              setAtivo={setAtivo}
              setTocando={setTocando}
            />
          </div>

          {/* Sobre */}
          <Bloco titulo="Sobre o jogo" className="gd-rise" delay={60}>
            <p className="max-w-3xl font-body text-[15px] leading-relaxed text-white/75">
              {game.descricao}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {game.tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 border border-white/10 bg-ink-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/55 transition-colors hover:border-acid/50 hover:text-white"
                >
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>
          </Bloco>

          {/* Destaques */}
          {game.destaques.length > 0 && (
            <Bloco titulo="Destaques" className="gd-rise" delay={100}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {game.destaques.map((d) => {
                  const Icone = ICONES[d.icon] || Sparkles;
                  return (
                    <div
                      key={d.label}
                      className="group flex items-center gap-3 border border-white/10 bg-ink-700 p-4 transition-colors hover:border-[var(--accent)]/60"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-[var(--accent)]"
                        style={{ background: `${acento}14` }}
                      >
                        <Icone size={18} />
                      </span>
                      <span className="font-body text-sm text-white/80">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </Bloco>
          )}

          {/* Requisitos */}
          <Bloco titulo="Requisitos do sistema" className="gd-rise" delay={140}>
            {game.req ? (
              <div
                className={`grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 ${game.req.rec ? 'sm:grid-cols-2' : ''
                  }`}
              >
                <Requisitos titulo="Mínimos" req={game.req.min} />
                {game.req.rec && (
                  <Requisitos titulo="Recomendados" req={game.req.rec} destaque />
                )}
              </div>
            ) : (
              <p className="border border-dashed border-white/15 bg-ink-700 p-5 font-mono text-xs uppercase tracking-wider text-white/45">
                Requisitos a serem divulgados
              </p>
            )}
          </Bloco>

          {/* Avaliações */}
          <Bloco titulo="Avaliações" className="gd-rise" delay={180}>
            {game.avaliacao ? (
              <div className="flex flex-col gap-4 border border-white/10 bg-ink-700 p-6 sm:flex-row sm:items-center sm:gap-8">
                <div className="flex shrink-0 items-baseline gap-1.5">
                  <span className="font-display text-5xl font-black text-acid">
                    {game.avaliacao.nota}
                  </span>
                  <span className="font-mono text-sm text-white/40">/100</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                    <span className="text-white">{game.avaliacao.rotulo}</span>
                    {game.avaliacao.total && (
                      <span className="text-white/40">{game.avaliacao.total} análises</span>
                    )}
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden bg-ink-900">
                    <div
                      className="h-full bg-gradient-to-r from-acid-dim to-acid"
                      style={{ width: `${game.avaliacao.nota}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="border border-dashed border-white/15 bg-ink-700 p-5 font-mono text-xs uppercase tracking-wider text-white/45">
                {game.preVenda ? 'Aguardando o lançamento — sem avaliações ainda' : 'Sem avaliações'}
              </p>
            )}
          </Bloco>

          {/* Comentários */}
          <Comentarios game={game} />
        </main>

        {/* ----- Painel de compra (sticky) ----- */}
        <aside className="gd-rise lg:sticky lg:top-[84px] lg:h-fit" style={{ animationDelay: '80ms' }}>
          <div className="relative border border-white/10 bg-ink-700 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]">
            {/* Faixa de acento no topo */}
            <div className="h-1 w-full" style={{ background: acento }} />

            <div className="p-6">
              {emOferta && (
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex items-center bg-acid px-2.5 py-1 font-display text-base font-extrabold text-ink-900">
                    -{game.discount}%
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-acid">
                    Oferta por tempo limitado
                  </span>
                </div>
              )}

              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col leading-none">
                  {emOferta && (
                    <span className="font-mono text-sm text-white/35 line-through">
                      {fmtBRL(game.oldPrice)}
                    </span>
                  )}
                  <span className="mt-1 font-display text-3xl font-black text-white">
                    {fmtBRL(game.price)}
                  </span>
                </div>
                {game.rating > 0 && (
                  <span className="flex items-center gap-1 font-mono text-sm text-white/70">
                    <Star size={14} className="fill-acid text-acid" />
                    {game.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <button className="clip-btn mt-5 flex w-full items-center justify-center gap-2 bg-acid py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-transform duration-200 hover:scale-[1.02] active:scale-95">
                {game.preVenda ? (
                  <><Plus size={16} /> Reservar agora</>
                ) : (
                  <><ShoppingCart size={16} /> Comprar</>
                )}
              </button>
              <button className="mt-2.5 flex w-full items-center justify-center gap-2 border border-white/15 py-3 font-mono text-xs uppercase tracking-widest text-white/80 transition-colors hover:border-signal hover:text-signal">
                <Heart size={14} /> Lista de desejos
              </button>

              <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/40">
                <Check size={13} className="text-acid" /> Ativação imediata na conta HALLOW
              </div>

              {/* Ficha técnica */}
              <div className="mt-6 space-y-px border-t border-white/10 pt-5">
                <MetaRow icon={Building2} rotulo="Desenvolvedora" valor={game.desenvolvedora} />
                <MetaRow icon={Building2} rotulo="Distribuidora" valor={game.distribuidora} />
                <MetaRow icon={Calendar} rotulo="Lançamento" valor={game.lancamento} />
                <MetaRow icon={Tag} rotulo="Gênero" valor={game.genre} />
                {game.idiomas && (
                  <MetaRow icon={Languages} rotulo="Idiomas" valor={game.idiomas} />
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Faixa de miniaturas — carrossel horizontal com setas/fades que só aparecem
   quando há mais imagens do que cabe; mantém a miniatura ativa centralizada. */
function Miniaturas({ game, ativo, setAtivo, setTocando }) {
  const trilhoRef = useRef(null);
  const [podeAntes, setPodeAntes] = useState(false);
  const [podeDepois, setPodeDepois] = useState(false);

  const atualizar = useCallback(() => {
    const el = trilhoRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPodeAntes(el.scrollLeft > 4);
    setPodeDepois(el.scrollLeft < max - 4);
  }, []);

  // Recalcula transbordo no mount e quando a área muda de tamanho.
  useEffect(() => {
    atualizar();
    const el = trilhoRef.current;
    const ro = new ResizeObserver(atualizar);
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [atualizar]);

  // Mantém a miniatura ativa centralizada acompanhando o auto-play, rolando
  // APENAS o trilho na horizontal (scrollIntoView puxaria a página inteira
  // na vertical, jogando a tela pro topo ao trocar de imagem sozinho).
  useEffect(() => {
    const el = trilhoRef.current;
    const item = el?.children[ativo];
    if (!el || !item) return;
    const er = el.getBoundingClientRect();
    const ir = item.getBoundingClientRect();
    const delta = ir.left - er.left - (el.clientWidth - item.clientWidth) / 2;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }, [ativo]);

  const rolar = (dir) => {
    const el = trilhoRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-3">
      <div
        ref={trilhoRef}
        onScroll={atualizar}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-1"
      >
        {game.media.map((m, i) => (
          <button
            key={i}
            onClick={() => {
              setAtivo(i);
              setTocando(m.type === 'video');
            }}
            className={`relative aspect-video w-32 shrink-0 overflow-hidden border transition-all ${ativo === i
                ? 'border-[var(--accent)] opacity-100'
                : 'border-white/10 opacity-55 hover:opacity-90'
              }`}
          >
            <img
              src={m.type === 'video' ? m.thumb : m.src}
              alt=""
              loading="lazy"
              onError={(e) => (e.currentTarget.src = ytThumb(game.youtube))}
              className="h-full w-full object-cover"
            />
            {m.type === 'video' && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play size={16} className="fill-white text-white" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Fade + seta (só quando há conteúdo escondido daquele lado) */}
      {podeAntes && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent" />
          <button
            onClick={() => rolar(-1)}
            aria-label="Imagens anteriores"
            className="absolute left-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/15 bg-ink-900/80 text-white backdrop-blur transition-colors hover:border-acid hover:text-acid"
          >
            <ChevronLeft size={16} />
          </button>
        </>
      )}
      {podeDepois && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent" />
          <button
            onClick={() => rolar(1)}
            aria-label="Próximas imagens"
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/15 bg-ink-900/80 text-white backdrop-blur transition-colors hover:border-acid hover:text-acid"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

/* Visor principal da galeria — imagem ou trailer (clique para tocar com som). */
function Visor({ game, ativo, tocando, setTocando }) {
  const item = game.media[ativo];
  const ehVideo = item.type === 'video';

  if (ehVideo && tocando) {
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black">
        {item.movie ? (
          <video
            title={`Trailer — ${game.title}`}
            src={item.movie}
            poster={item.thumb}
            autoPlay
            controls
            playsInline
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <iframe
            title={`Trailer — ${game.title}`}
            src={`https://www.youtube.com/embed/${game.youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
    );
  }

  const poster = ehVideo ? item.thumb : item.src;
  return (
    <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-ink-900">
      <img
        src={poster}
        alt={game.title}
        onError={(e) => (e.currentTarget.src = ytThumb(game.youtube))}
        className="h-full w-full object-cover"
      />
      {ehVideo && (
        <button
          onClick={() => setTocando(true)}
          aria-label="Reproduzir trailer"
          className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink-900/40 via-transparent to-transparent transition-colors"
        >
          <span className="flex h-16 w-16 items-center justify-center bg-acid text-ink-900 shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-110">
            <Play size={26} className="ml-1 fill-ink-900" />
          </span>
        </button>
      )}
    </div>
  );
}

/* Coluna de requisitos (mínimos/recomendados). */
function Requisitos({ titulo, req, destaque }) {
  const linhas = [
    { icon: Monitor, rotulo: 'SO', valor: req.so },
    { icon: Cpu, rotulo: 'Processador', valor: req.cpu },
    { icon: MemoryStick, rotulo: 'Memória', valor: req.ram },
    { icon: MonitorPlay, rotulo: 'Vídeo', valor: req.gpu },
    { icon: HardDrive, rotulo: 'Armazenamento', valor: req.disco },
  ].filter((l) => l.valor);
  return (
    <div className="bg-ink-700 p-5">
      <h4
        className={`mb-4 font-mono text-xs font-bold uppercase tracking-widest ${destaque ? 'text-acid' : 'text-white/60'
          }`}
      >
        {titulo}
      </h4>
      <dl className="space-y-3">
        {linhas.map((l) => (
          <div key={l.rotulo} className="flex items-start gap-3">
            <l.icon size={14} className="mt-0.5 shrink-0 text-white/35" />
            <div className="min-w-0">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                {l.rotulo}
              </dt>
              <dd className="font-body text-sm text-white/80">{l.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* Linha de metadado do painel lateral. */
function MetaRow({ icon: Icone, rotulo, valor }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/40">
        <Icone size={13} /> {rotulo}
      </span>
      <span className="text-right font-body text-sm text-white/85">{valor}</span>
    </div>
  );
}

/* Estrelas (1..5). Com `onChange` vira um seletor clicável. */
function Estrelas({ nota, onChange, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const cheia = n <= nota;
        const cls = cheia ? 'fill-acid text-acid' : 'text-white/25';
        return onChange ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
            className="transition-transform hover:scale-110"
          >
            <Star size={size + 3} className={cls} />
          </button>
        ) : (
          <Star key={n} size={size} className={cls} />
        );
      })}
    </div>
  );
}

/* Área de comentários — fictícios e determinísticos por jogo, com campo para
   publicar um comentário local (reseta ao trocar de jogo, pois o Painel é
   remontado por `key={game.id}`). */
function Comentarios({ game }) {
  const plataformas = game.platforms?.length ? game.platforms : ['PC'];
  const base = useMemo(() => getComments(game), [game]);
  const [extras, setExtras] = useState([]);
  const [curtidos, setCurtidos] = useState(() => new Set());
  const [texto, setTexto] = useState('');
  const [nota, setNota] = useState(5);
  const [plataforma, setPlataforma] = useState(plataformas[0]);

  const lista = [...extras, ...base];
  const media = lista.length
    ? (lista.reduce((s, c) => s + c.nota, 0) / lista.length).toFixed(1)
    : '0.0';

  const enviar = (e) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    setExtras((x) => [
      {
        id: `meu-${Date.now()}`,
        autor: 'Você',
        cor: '#d6ff3f',
        nota,
        texto: t,
        quando: 'agora',
        curtidas: 0,
        plataforma,
        recomenda: nota >= 4,
        meu: true,
      },
      ...x,
    ]);
    setTexto('');
    setNota(5);
    setPlataforma(plataformas[0]);
  };

  const deletar = (id) => setExtras((x) => x.filter((c) => c.id !== id));

  const curtir = (id) =>
    setCurtidos((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <Bloco titulo={`Comentários · ${lista.length}`} className="gd-rise" delay={220}>
      {/* Resumo */}
      <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-white/55">
        <Estrelas nota={Math.round(media)} />
        <span className="text-white">{media}</span>
        <span className="text-white/30">·</span>
        <span>{lista.length} comentários da comunidade</span>
      </div>

      {/* Campo para publicar */}
      <form onSubmit={enviar} className="mb-7 border border-white/10 bg-ink-700 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/45">
              Sua nota
            </span>
            <Estrelas nota={nota} onChange={setNota} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/45">
              Plataforma
            </span>
            <div className="flex gap-1.5">
              {plataformas.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlataforma(p)}
                  className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${plataforma === p
                      ? 'border-acid bg-acid text-ink-900'
                      : 'border-white/15 text-white/55 hover:border-white/40 hover:text-white'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Deixe seu comentário sobre o jogo…"
          className="w-full resize-none border border-white/10 bg-ink-900 p-3 font-body text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-acid/60"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
            {texto.length}/400
          </span>
          <button
            type="submit"
            disabled={!texto.trim()}
            className="clip-btn flex items-center gap-2 bg-acid px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-ink-900 transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={14} /> Publicar
          </button>
        </div>
      </form>

      {/* Lista */}
      <div className="divide-y divide-white/5">
        {lista.map((c) => {
          const liked = curtidos.has(c.id);
          return (
            <article key={c.id} className="flex gap-3.5 py-5 first:pt-0">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-ink-900"
                style={{ background: c.cor }}
              >
                {c.autor[0].toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="font-body text-sm font-semibold text-white">
                    {c.autor}
                  </span>
                  {c.meu && (
                    <span className="bg-acid px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink-900">
                      Você
                    </span>
                  )}
                  <span className="border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/45">
                    {c.plataforma}
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-white/35">
                    {c.quando}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Estrelas nota={c.nota} size={12} />
                  {c.recomenda && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-acid">
                      Recomenda
                    </span>
                  )}
                </div>
                <p className="mt-2 font-body text-sm leading-relaxed text-white/75">
                  {c.texto}
                </p>
                <div className="mt-2.5 flex items-center gap-4">
                  <button
                    onClick={() => curtir(c.id)}
                    className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${liked ? 'text-acid' : 'text-white/40 hover:text-white'
                      }`}
                  >
                    <ThumbsUp size={13} className={liked ? 'fill-acid' : ''} />
                    Útil · {c.curtidas + (liked ? 1 : 0)}
                  </button>
                  {c.meu && (
                    <button
                      onClick={() => deletar(c.id)}
                      className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white/40 transition-colors hover:text-signal"
                    >
                      <Trash2 size={13} /> Excluir
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Bloco>
  );
}

/* Bloco de conteúdo com título de seção (label mono + régua acid). */
function Bloco({ titulo, children, className = '', delay = 0 }) {
  return (
    <section className={`mt-12 ${className}`} style={delay ? { animationDelay: `${delay}ms` } : undefined}>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-3 w-1 bg-acid" />
        <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
          {titulo}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function IconBtn({ children, label }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-acid"
    >
      {children}
    </button>
  );
}

/* Estilos com escopo no overlay (entrada escalonada). */
function ScopedStyles() {
  return (
    <style>{`
      .gd-rise { opacity: 0; animation: gd-rise 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
      @keyframes gd-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) {
        .gd-rise { animation: none; opacity: 1; }
      }
    `}</style>
  );
}

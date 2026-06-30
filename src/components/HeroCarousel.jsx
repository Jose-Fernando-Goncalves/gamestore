import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Plus, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { featured, fmtBRL } from '../data/games';
import { useGameDetails } from '../context/GameDetailsContext';

const DURATION = 60000; // ms por slide (1 min — deixa o trailer tocar mais tempo)
const VOLUME = 30; // volume padrão do trailer (%)

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { abrir } = useGameDetails();
  const muted = true; // vídeo sempre mudo (sem controle de áudio na UI)
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const game = featured[index];

  const go = useCallback((next) => {
    setIndex((i) => (next + featured.length) % featured.length);
    setProgress(0);
    startRef.current = performance.now();
  }, []);

  // Loop de progresso + auto-advance
  useEffect(() => {
    startRef.current = performance.now() - progress * DURATION;

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        go(index + 1);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Teclas de seta
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  return (
    <section
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink-900"
      aria-roledescription="carrossel"
      aria-label="Jogos em destaque"
    >
      {/* Camadas de mídia (vídeo/pôster) por slide */}
      {featured.map((g, i) => (
        <Slide key={g.id} game={g} active={i === index} muted={muted} />
      ))}

      {/* Gradiente preto à esquerda (painel de informações) + base */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-ink-900 from-5% via-ink-900/55 via-35% to-transparent to-60%" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent" />

      {/* ===== Conteúdo inferior ===== */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-6 pb-10 sm:px-10 lg:px-16 lg:pb-16">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Bloco do título + compra */}
          <div key={game.id} className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-2.5 animate-rise">
              <span
                className="clip-btn px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-ink-900"
                style={{ background: game.accent }}
              >
                {game.discount}% OFF
              </span>
              <span className="border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-chrome backdrop-blur-sm">
                {game.genre}
              </span>
              <span className="flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] tracking-wider text-white backdrop-blur-sm">
                <Star size={12} className="fill-acid text-acid" />
                {game.rating.toFixed(1)}
              </span>
            </div>

            <p
              className="mb-1 animate-rise font-mono text-xs uppercase tracking-[0.35em]"
              style={{ animationDelay: '60ms', color: game.accent, opacity: 0 }}
            >
              {game.studio} · {game.year}
            </p>

            <h1
              className="animate-rise font-display text-5xl font-extrabold leading-[0.9] tracking-tightest text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '100ms', opacity: 0 }}
            >
              {game.title}
            </h1>
            <p
              className="mt-3 animate-rise font-display text-lg font-normal text-chrome sm:text-xl"
              style={{ animationDelay: '160ms', opacity: 0 }}
            >
              {game.subtitle}
            </p>

            <div
              className="mt-4 flex animate-rise flex-wrap gap-2"
              style={{ animationDelay: '220ms', opacity: 0 }}
            >
              {game.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Preço + Botões de compra (lateral inferior) */}
            <div
              className="mt-7 flex animate-rise flex-wrap items-center gap-4"
              style={{ animationDelay: '300ms', opacity: 0 }}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-white/40 line-through">
                  {fmtBRL(game.oldPrice)}
                </span>
                <span className="font-display text-3xl font-bold text-white">
                  {fmtBRL(game.price)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => abrir(game)}
                  className="clip-btn group flex items-center gap-2.5 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-ink-900 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: game.accent }}
                >
                  <Play size={16} className="fill-ink-900" />
                  Comprar agora
                </button>
                <button className="group flex h-[50px] w-[50px] items-center justify-center border border-white/20 bg-white/5 text-white backdrop-blur-md transition-colors duration-200 hover:border-acid hover:text-acid">
                  <Plus
                    size={18}
                    className="transition-transform duration-200 group-hover:rotate-90"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Seletor de slides (thumbnails) */}
          <div className="flex items-center gap-3 self-start lg:self-end">
            <div className="hidden gap-2.5 sm:flex">
              {featured.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => go(i)}
                  aria-label={`Ver ${g.title}`}
                  className={`group relative h-20 w-32 overflow-hidden border transition-all duration-300 ${
                    i === index
                      ? 'border-acid'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                  style={{ background: g.poster }}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${g.youtube}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/95 to-transparent px-2 pb-1.5 pt-5 text-left">
                    <span className="block truncate font-display text-[10px] font-bold uppercase tracking-wide text-white">
                      {g.title}
                    </span>
                  </span>
                  {i === index && (
                    <span className="absolute inset-x-0 top-0 h-[3px] bg-white/15">
                      <span
                        className="block h-full"
                        style={{
                          width: `${progress * 100}%`,
                          background: g.accent,
                        }}
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Barra de controles inferior */}
        <div className="mx-auto mt-8 flex max-w-[1500px] items-center justify-between border-t border-white/10 pt-5">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-white/40">
              {String(index + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go(index - 1)}
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-acid hover:text-acid"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => go(index + 1)}
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-acid hover:text-acid"
              aria-label="Próximo"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Camada individual de mídia: trailer do YouTube de fundo + pôster fallback. No
   hero usamos o embed do YouTube (não o vídeo estático do Steam) porque ele
   entrega HD num player desse tamanho — o movie480.mp4 do Steam é só 480p. */
function Slide({ game, active, muted }) {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Comandos para o player do YouTube via postMessage (enablejsapi=1)
  const command = (func, args = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
    );
  };

  // Apenas ajusta o volume para 30%. O estado de mudo vai direto na URL do
  // embed (mute=0/1), então nunca chamamos unMute num vídeo já tocando — é
  // isso que evitava a pausa (e o overlay de controles) ao trocar de slide.
  useEffect(() => {
    if (!active || !loaded) return undefined;
    const apply = () => command('setVolume', [VOLUME]);
    apply();
    const t = setTimeout(apply, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, loaded]);

  // Reinicia o trailer ao voltar para o slide
  useEffect(() => {
    if (!active) setLoaded(false);
  }, [active]);

  // Sem loop/playlist de propósito: o carrossel troca de slide (60s) muito
  // antes do trailer acabar, e os params loop/playlist são o que faz o YouTube
  // exibir o overlay de controles (anterior/pause/próximo). Ao voltar ao slide
  // o iframe remonta e o trailer recomeça do início. `vq=hd1080` é uma dica de
  // qualidade (o player ainda decide pela banda/tamanho, mas pede HD).
  const src =
    `https://www.youtube.com/embed/${game.youtube}` +
    `?autoplay=1&mute=${muted ? 1 : 0}&controls=0&start=${game.start ?? 0}` +
    `&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3` +
    `&disablekb=1&fs=0&enablejsapi=1&vq=hd1080`;

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden={!active}
    >
      {/* Pôster animado (fallback / fundo enquanto o vídeo carrega) */}
      <div
        className={`absolute inset-0 ${active ? 'animate-ken-burns' : ''}`}
        style={{ background: game.poster }}
      >
        <div
          className="absolute -left-1/4 top-0 h-full w-2/3 blur-[120px]"
          style={{ background: game.glow }}
        />
      </div>

      {/* Trailer do YouTube cobrindo a área (16:9 escalado para cover) */}
      {active && (
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            // Dissolve a borda esquerda do vídeo no fundo (pôster), eliminando
            // a linha vertical dura entre a área de mídia e o painel escuro.
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 18%, #000 42%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 18%, #000 42%)',
          }}
        >
          <iframe
            ref={iframeRef}
            onLoad={() => setLoaded(true)}
            title={`Trailer — ${game.title}`}
            src={src}
            allow="autoplay; encrypted-media"
            frameBorder="0"
            className="pointer-events-none absolute left-[75%] top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.2]"
          />
        </div>
      )}
    </div>
  );
}

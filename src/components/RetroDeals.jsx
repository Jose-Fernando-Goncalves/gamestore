import { Coins } from 'lucide-react';
import { retroGames, retroTheme } from '../data/retro';
import { fmtBRL } from '../data/games';
import { useTrailerPreview } from '../hooks/useTrailerPreview';
import { useGameDetails } from '../context/GameDetailsContext';
import { useCart } from '../context/CartContext';

export default function RetroDeals() {
  return (
    <section
      id="retro"
      className="med relative overflow-hidden py-20 lg:py-28"
      style={retroTheme}
      aria-label="Aventuras Retrô — clássicos medievais"
    >
      <ScopedStyles />

      {/* ===== Cenário (fundo customizável por reino) ===== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="med-sky absolute inset-0" />
        <div className="med-crest-glow absolute left-1/2 top-[14%] h-72 w-72 -translate-x-1/2" />
        <Skyline />
        <Embers />
        <div className="med-scan absolute inset-0" />
        <div className="med-vignette absolute inset-0" />
        <div className="med-rule absolute inset-x-0 top-0" />
        <div className="med-rule absolute inset-x-0 bottom-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        {/* ===== Cabeçalho ===== */}
        <div className="flex flex-col items-center text-center">
          <Triforce />
          <span className="mt-4 block font-pixel text-[10px] tracking-[0.25em] text-[var(--accent)]">
            ✦ EDIÇÃO RETRÔ ✦
          </span>
          <h2 className="med-title mt-3 font-heraldic text-4xl font-black leading-tight text-[var(--gold)] sm:text-5xl lg:text-6xl">
            Reinos Pixelados
          </h2>
          <p className="mt-4 max-w-md font-medieval text-base tracking-wide text-white/70">
            Aventuras retrô de espada e magia — masmorras, segredos e ouro à
            espera de quem ousar entrar.
          </p>
        </div>

        {/* ===== Grade de aventuras ===== */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {retroGames.map((g, i) => (
            <RetroCard key={g.id} game={g} index={i} />
          ))}
        </div>

        {/* ===== Rodapé ===== */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="med-divider" />
          <span className="font-medieval text-sm uppercase tracking-[0.35em] text-[var(--gold)]/80">
            ⚔ Que a coragem guie sua jornada ⚔
          </span>
        </div>
      </div>
    </section>
  );
}

/* Card — tabuleta emoldurada em ouro, com capa real + prévia do trailer */
function RetroCard({ game, index }) {
  const { abrir } = useGameDetails();
  const { add } = useCart();
  const { preview, videoReady, videoRef, trailerUrl, onPlaying, startPreview, stopPreview } =
    useTrailerPreview(game.trailer);

  return (
    <article
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onClick={() => abrir(game)}
      className="med-card group relative flex cursor-pointer flex-col"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Cantoneiras */}
      <span className="med-corner -left-[3px] -top-[3px]" />
      <span className="med-corner -right-[3px] -top-[3px]" />
      <span className="med-corner -bottom-[3px] -left-[3px]" />
      <span className="med-corner -bottom-[3px] -right-[3px]" />

      {/* Capa (imagem real) */}
      <div className="relative aspect-[460/215] overflow-hidden bg-black/40">
        <img
          src={game.cover}
          alt={game.title}
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== game.fallback)
              e.currentTarget.src = game.fallback;
          }}
          className="absolute inset-0 h-full w-full scale-[1.02] transform-gpu object-cover transition-transform duration-500 ease-out [backface-visibility:hidden] will-change-transform group-hover:scale-110"
        />

        {/* Prévia do trailer (após 1s parado em cima) */}
        {preview && (
          <div
            className={`absolute inset-0 overflow-hidden bg-black transition-opacity duration-500 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <video
              ref={videoRef}
              title={`Prévia — ${game.title}`}
              src={trailerUrl}
              onPlaying={onPlaying}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}

        {/* Brilho do reino no topo da arte */}
        <div className="med-art-glow pointer-events-none absolute inset-0" />

        {/* Selo de desconto (estandarte) — só quando em oferta */}
        {game.discount > 0 && (
          <span className="med-banner absolute right-2 top-0 font-pixel text-[10px] text-black">
            -{game.discount}%
          </span>
        )}
        {/* Categoria */}
        <span className="absolute left-2 top-2 border border-[var(--gold)]/40 bg-black/60 px-2 py-1 font-medieval text-[10px] uppercase tracking-wider text-[var(--gold)]">
          {game.kind}
        </span>
      </div>

      {/* Placa */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <h3 className="font-pixel text-[11px] leading-snug text-white transition-colors group-hover:text-[var(--gold)]">
          {game.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 font-medieval text-sm text-white/55">
          <span>Anno {game.year}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="flex flex-col leading-none">
            {game.discount > 0 && (
              <span className="font-medieval text-sm text-white/40 line-through">
                {fmtBRL(game.oldPrice)}
              </span>
            )}
            <span className="mt-1 flex items-center gap-1.5 font-pixel text-xs text-[var(--gold)]">
              <Coins size={13} /> {fmtBRL(game.price)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              add(game);
            }}
            className="med-buy flex items-center gap-1.5 px-3 py-2 font-medieval text-xs font-bold uppercase tracking-wide"
            aria-label={`Comprar ${game.title}`}
          >
            Adquirir
          </button>
        </div>
      </div>
    </article>
  );
}

/* Brasão triforce (puro CSS) */
function Triforce() {
  return (
    <div className="med-triforce mx-auto" aria-hidden>
      <span className="med-tri" />
      <span className="med-tri" />
      <span className="med-tri" />
    </div>
  );
}

/* Silhueta de colinas + castelo no horizonte */
function Skyline() {
  return (
    <svg
      className="med-skyline absolute inset-x-0 bottom-0 h-[42%] w-full"
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <path
        fill="var(--hill)"
        d="M0 300V170c90-50 150 10 250-6s140-70 250-58 180 64 290 40 180-66 290-44 0 0 120 30v168z"
        opacity="0.9"
      />
      {/* castelo central */}
      <g fill="var(--hill)">
        <rect x="556" y="118" width="88" height="92" />
        <rect x="540" y="132" width="20" height="78" />
        <rect x="640" y="132" width="20" height="78" />
        <rect x="592" y="92" width="16" height="118" />
        {/* ameias */}
        <rect x="556" y="110" width="12" height="12" />
        <rect x="576" y="110" width="12" height="12" />
        <rect x="596" y="110" width="12" height="12" />
        <rect x="616" y="110" width="12" height="12" />
        <rect x="632" y="110" width="12" height="12" />
      </g>
      {/* bandeira */}
      <path d="M600 78v16l18-8z" fill="var(--gold)" opacity="0.85" />
    </svg>
  );
}

/* Fagulhas/vagalumes flutuando */
function Embers() {
  const dots = [
    { l: '12%', d: '0s', s: 7 },
    { l: '26%', d: '1.4s', s: 5 },
    { l: '38%', d: '2.6s', s: 8 },
    { l: '55%', d: '0.8s', s: 6 },
    { l: '68%', d: '2s', s: 7 },
    { l: '80%', d: '3.2s', s: 5 },
    { l: '90%', d: '1.1s', s: 8 },
  ];
  return (
    <div className="absolute inset-0">
      {dots.map((p, i) => (
        <span
          key={i}
          className="med-ember"
          style={{ left: p.l, animationDelay: p.d, width: p.s, height: p.s }}
        />
      ))}
    </div>
  );
}

/* Estilos da seção (escopo .med) + keyframes */
function ScopedStyles() {
  return (
    <style>{`
      .med { background: var(--ink); }
      .med-sky {
        background:
          radial-gradient(120% 90% at 50% 8%, var(--mist), transparent 55%),
          linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 55%, var(--ink) 92%);
      }
      .med-crest-glow {
        border-radius: 50%;
        background: radial-gradient(circle, color-mix(in srgb, var(--gold) 55%, transparent), transparent 68%);
        filter: blur(8px);
        animation: med-pulse 6s ease-in-out infinite;
      }
      .med-skyline { filter: drop-shadow(0 0 18px color-mix(in srgb, var(--gold) 25%, transparent)); }
      .med-scan {
        background: repeating-linear-gradient(to bottom, rgba(0,0,0,0.16) 0 2px, transparent 2px 4px);
        mix-blend-mode: multiply; opacity: 0.7;
      }
      .med-vignette { background: radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(0,0,0,0.6) 100%); }
      .med-rule {
        height: 6px;
        background:
          linear-gradient(var(--gold), var(--gold)) center/100% 1px no-repeat,
          repeating-linear-gradient(45deg, var(--gold) 0 1px, transparent 1px 7px);
        opacity: 0.5;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
      }
      .med-divider {
        width: 220px; height: 6px;
        background: repeating-linear-gradient(45deg, var(--gold) 0 1px, transparent 1px 7px);
        opacity: 0.55;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent);
      }

      /* Brasão triforce */
      .med-triforce { position: relative; width: 64px; height: 56px; }
      .med-tri {
        position: absolute; width: 0; height: 0;
        border-left: 16px solid transparent; border-right: 16px solid transparent;
        border-bottom: 28px solid var(--gold);
        filter: drop-shadow(0 0 8px color-mix(in srgb, var(--gold) 70%, transparent));
        animation: med-pulse 4s ease-in-out infinite;
      }
      .med-tri:nth-child(1) { top: 0; left: 16px; }
      .med-tri:nth-child(2) { bottom: 0; left: 0; }
      .med-tri:nth-child(3) { bottom: 0; right: 0; }

      .med-title { text-shadow: 0 2px 0 rgba(0,0,0,0.5), 0 0 24px color-mix(in srgb, var(--gold) 40%, transparent); }

      /* Cards */
      .med-card {
        opacity: 0; animation: med-rise 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        background: linear-gradient(180deg, color-mix(in srgb, var(--ink) 82%, #000), #07070a);
        border: 2px solid color-mix(in srgb, var(--gold) 38%, transparent);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6), 0 14px 36px -18px rgba(0,0,0,0.9);
        transition: transform .2s, border-color .2s, box-shadow .2s;
      }
      .med-card:hover {
        transform: translateY(-6px);
        border-color: var(--gold);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6), 0 0 22px -4px color-mix(in srgb, var(--gold) 60%, transparent), 0 22px 44px -18px rgba(0,0,0,0.9);
      }
      .med-corner {
        position: absolute; z-index: 5; width: 9px; height: 9px;
        background: var(--gold); transform: rotate(45deg);
        box-shadow: 0 0 8px color-mix(in srgb, var(--gold) 70%, transparent);
      }
      .med-art-glow { background: radial-gradient(80% 60% at 50% 0%, var(--mist), transparent 70%); mix-blend-mode: screen; }
      .med-banner {
        padding: 6px 8px 8px;
        background: var(--gold);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%);
      }
      .med-buy {
        color: #1a1206;
        background: linear-gradient(180deg, var(--gold), color-mix(in srgb, var(--gold) 70%, #000));
        border: 1px solid color-mix(in srgb, var(--gold) 60%, #000);
        clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
        transition: filter .15s, transform .15s;
      }
      .med-buy:hover { filter: brightness(1.12); transform: translateY(-1px); }

      /* Fagulhas */
      .med-ember {
        position: absolute; bottom: -10px; border-radius: 50%;
        background: var(--gold);
        box-shadow: 0 0 8px 1px color-mix(in srgb, var(--gold) 80%, transparent);
        opacity: 0; animation: med-float 7s linear infinite;
      }

      @keyframes med-pulse { 0%,100% { opacity: .75; } 50% { opacity: 1; } }
      @keyframes med-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes med-float {
        0% { transform: translateY(0) scale(1); opacity: 0; }
        12% { opacity: 1; }
        85% { opacity: .9; }
        100% { transform: translateY(-340px) scale(0.5); opacity: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .med-tri, .med-crest-glow, .med-card, .med-ember { animation: none !important; }
        .med-card { opacity: 1; }
        .med-ember { display: none; }
      }
    `}</style>
  );
}

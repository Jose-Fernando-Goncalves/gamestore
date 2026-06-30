import { useState } from 'react';
import { Star, Plus, ShoppingCart, Heart, Check } from 'lucide-react';
import { coverSources, steamTrailer } from '../data/catalog';
import { fmtBRL } from '../data/games';
import { useTrailerPreview } from '../hooks/useTrailerPreview';
import { useGameDetails } from '../context/GameDetailsContext';
import { useCart } from '../context/CartContext';
import { useLibrary } from '../context/LibraryContext';

const badgeStyles = {
  Promoção: 'bg-acid text-ink-900',
  Lançamento: 'bg-white text-ink-900',
  'Pré-venda': 'bg-signal text-white',
  'Mais vendido': 'bg-ink-900 text-acid border border-acid',
};

// Card de jogo PADRÃO do site — usado no grid, no catálogo, nas ofertas e nos
// tópicos. `className` permite ajustes pontuais (ex.: largura fixa no carrossel)
// sem quebrar o layout. O único card diferente é o da seção Retrô.
export default function GameCard({ game, className = '' }) {
  const [liked, setLiked] = useState(false);
  const sources = coverSources(game);
  const [srcIdx, setSrcIdx] = useState(0);
  const { abrir } = useGameDetails();
  const { add } = useCart();
  const { isOwned, claim } = useLibrary();
  const owned = isOwned(game.id);
  const gratis = game.price === 0;
  const { preview, videoReady, videoRef, trailerUrl, onPlaying, startPreview, stopPreview } =
    useTrailerPreview(game.steamMovie ? steamTrailer(game.steamMovie) : null);

  return (
    <article
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onClick={() => abrir(game)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden border border-white/10 bg-ink-700 transition-all duration-300 hover:-translate-y-1.5 hover:border-acid/60 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] ${className}`}
    >
      {/* Capa — proporção nativa da capsule oficial do Steam (460x215) para
          a arte aparecer inteira, sem corte das laterais. */}
      <div
        className="relative aspect-[460/215] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${game.accent}22, #0b0b11 70%)`,
        }}
      >
        {srcIdx < sources.length && (
          <img
            src={sources[srcIdx]}
            alt={game.title}
            loading="lazy"
            onError={() => setSrcIdx((i) => i + 1)}
            className="absolute inset-0 h-full w-full scale-[1.02] transform-gpu object-cover transition-transform duration-700 ease-out [backface-visibility:hidden] will-change-transform group-hover:scale-110"
          />
        )}

        {/* Preview do trailer (após 1s parado em cima) */}
        {preview && (
          <div
            className={`absolute inset-0 overflow-hidden bg-ink-900 transition-opacity duration-500 ${
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

        {/* Selo */}
        {game.badge && (
          <span
            className={`clip-btn absolute left-0 top-0 m-3 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
              badgeStyles[game.badge] || 'bg-white/10 text-white'
            }`}
          >
            {game.badge}
          </span>
        )}

        {/* % off */}
        {game.discount > 0 && (
          <span className="absolute right-0 top-0 m-3 flex items-center justify-center bg-acid px-2 py-1 font-display text-sm font-extrabold text-ink-900">
            -{game.discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          aria-label="Lista de desejos"
          className="absolute bottom-0 right-0 m-3 flex h-9 w-9 translate-y-2 items-center justify-center border border-white/15 bg-ink-900/70 text-white opacity-0 backdrop-blur transition-all duration-300 hover:border-signal hover:text-signal group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Heart size={15} className={liked ? 'fill-signal text-signal' : ''} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-chrome">
            {game.genre}
          </span>
          {game.rating > 0 && (
            <span className="flex items-center gap-1 font-mono text-[11px] text-white/80">
              <Star size={11} className="fill-acid text-acid" />
              {game.rating.toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="font-display text-base font-bold leading-tight text-white transition-colors group-hover:text-acid">
          {game.title}
        </h3>

        <div className="mt-1.5 flex flex-wrap gap-1">
          {(game.platforms ?? []).map((p) => (
            <span
              key={p}
              className="border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/50"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Preço + ação */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="flex flex-col">
            {game.discount > 0 && (
              <span className="font-mono text-[11px] text-white/35 line-through">
                {fmtBRL(game.oldPrice)}
              </span>
            )}
            <span className="font-display text-lg font-bold text-white">
              {game.price === 0 ? 'Gratuito' : fmtBRL(game.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (owned) return;
              gratis ? claim(game) : add(game);
            }}
            disabled={owned}
            className={`clip-btn flex items-center gap-1.5 px-3.5 py-2.5 font-display text-xs font-bold uppercase tracking-wide transition-transform duration-200 ${
              owned
                ? 'cursor-default bg-white/10 text-white/60'
                : 'bg-acid text-ink-900 hover:scale-105 active:scale-95'
            }`}
            aria-label={
              owned
                ? `${game.title} já está na biblioteca`
                : gratis
                  ? `Obter ${game.title}`
                  : `Comprar ${game.title}`
            }
          >
            {owned ? (
              <>
                <Check size={14} /> Na biblioteca
              </>
            ) : gratis ? (
              <>
                <Plus size={14} /> Obter
              </>
            ) : game.badge === 'Pré-venda' ? (
              <>
                <Plus size={14} /> Reservar
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Comprar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

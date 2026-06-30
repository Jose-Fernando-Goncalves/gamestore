import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { topics } from '../data/topics';
import GameCard from './GameCard';

export default function TopicCarousels() {
  return (
    <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
      <div className="flex flex-col gap-16">
        {topics.map((t) => (
          <TopicRow key={t.id} topic={t} />
        ))}
      </div>
    </section>
  );
}

/* Uma linha = título + carrossel horizontal de cards */
function TopicRow({ topic }) {
  const trackRef = useRef(null);

  const scrollByCards = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // rola ~85% da largura visível (cerca de uma "página" de cards)
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Cabeçalho do tópico */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tightest text-white sm:text-3xl">
            {topic.title}
            <span className="ml-3 align-middle font-mono text-xs font-normal tracking-widest text-acid">
              {topic.games.length} jogos
            </span>
          </h2>
          <p className="mt-1 font-body text-sm text-chrome">{topic.tagline}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => scrollByCards(-1)}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-acid hover:text-acid"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByCards(1)}
            aria-label="Próximo"
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-acid hover:text-acid"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Trilho */}
      <div
        ref={trackRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {topic.games.map((g) => (
          <GameCard
            key={g.id}
            game={g}
            className="w-[280px] shrink-0 snap-start sm:w-[300px]"
          />
        ))}
      </div>
    </div>
  );
}

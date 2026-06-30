import { useMemo, useState } from 'react';
import { catalog } from '../data/catalog';
import GameCard from './GameCard';

const filters = ['Todos', 'Action RPG', 'Aventura', 'Terror', 'Promoção', 'Pré-venda'];

export default function GameGrid() {
  const [active, setActive] = useState('Todos');

  const list = useMemo(() => {
    if (active === 'Todos') return catalog;
    if (active === 'Promoção')
      return catalog.filter((g) => g.discount > 0);
    if (active === 'Pré-venda')
      return catalog.filter((g) => g.badge === 'Pré-venda');
    return catalog.filter((g) => g.genre === active);
  }, [active]);

  return (
    <section
      id="loja"
      className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
            // Catálogo
          </span>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tightest text-white sm:text-5xl">
            Em alta agora
          </h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ${
                active === f
                  ? 'border-acid bg-acid text-ink-900'
                  : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-16 text-center font-mono text-sm text-chrome">
          Nenhum jogo nesta categoria por enquanto.
        </p>
      )}
    </section>
  );
}

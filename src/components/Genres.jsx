import { Link } from 'react-router-dom';
import {
  Swords,
  Sword,
  Castle,
  Compass,
  Flame,
  Ghost,
  Crosshair,
  Brain,
  Gamepad2,
  Trophy,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { gamesLibrary, genreFacets } from '../data/library';

// Ícone por gênero da biblioteca.
const GENRE_ICON = {
  'Action RPG': Swords,
  RPG: Castle,
  Aventura: Compass,
  Ação: Flame,
  Terror: Ghost,
  FPS: Crosshair,
  Estratégia: Brain,
  Luta: Sword,
  MOBA: Gamepad2,
  Esporte: Trophy,
  Indie: Sparkles,
};

// Gêneros reais + contagem de títulos, direto da biblioteca de jogos.
const facetas = genreFacets(gamesLibrary);

export default function Genres() {
  return (
    <section id="explore" className="relative border-y border-white/10 bg-ink-800">
      <div className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
              // Explore
            </span>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tightest text-white sm:text-5xl">
              Navegue por gênero
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
          {facetas.map((g) => {
            const Icon = GENRE_ICON[g.name] || Gamepad2;
            return (
              <Link
                key={g.name}
                to={`/catalogo?genero=${encodeURIComponent(g.name)}`}
                className="group relative flex flex-col gap-6 bg-ink-700 p-6 transition-colors duration-300 hover:bg-ink-600"
              >
                <div className="flex items-start justify-between">
                  <Icon
                    size={28}
                    className="text-chrome transition-colors duration-300 group-hover:text-acid"
                  />
                  <ArrowUpRight
                    size={18}
                    className="text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {g.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-chrome">
                    {g.count} {g.count === 1 ? 'título' : 'títulos'}
                  </p>
                </div>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-acid transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

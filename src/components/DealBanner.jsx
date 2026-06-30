import { useEffect, useState } from 'react';
import { Zap, ArrowRight, Snowflake } from 'lucide-react';
import { winterDeals } from '../data/deals';
import GameCard from './GameCard';

// Conta regressiva fictícia (48h a partir do carregamento)
function useCountdown(hoursFromNow = 48) {
  const [target] = useState(() => Date.now() + hoursFromNow * 3600 * 1000);
  const [left, setLeft] = useState(target - Date.now());

  useEffect(() => {
    const t = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  const s = Math.max(0, Math.floor(left / 1000));
  return {
    h: String(Math.floor(s / 3600)).padStart(2, '0'),
    m: String(Math.floor((s % 3600) / 60)).padStart(2, '0'),
    s: String(s % 60).padStart(2, '0'),
  };
}

export default function DealBanner() {
  const { h, m, s } = useCountdown(48);

  return (
    <section className="relative w-full overflow-hidden bg-acid py-14 sm:py-16">
      {/* Padrão de fundo diagonal */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #07070a 0 2px, transparent 2px 22px)',
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        {/* ===== Topo: título + countdown ===== */}
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-ink-900 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-acid">
              <Zap size={13} className="fill-acid" /> Oferta relâmpago
            </span>
            <h2 className="mt-5 flex items-start gap-3 font-display text-4xl font-black uppercase leading-[0.92] tracking-tightest text-ink-900 sm:text-6xl">
              <span>
                Festival
                <br />
                de Inverno
              </span>
              <Snowflake
                size={34}
                className="mt-1 shrink-0 text-ink-900/70"
                strokeWidth={2.5}
              />
            </h2>
            <p className="mt-4 max-w-md font-body text-sm font-medium text-ink-900/80">
              Até <strong className="font-bold">73% OFF</strong> em centenas de
              títulos selecionados. Chaves entregues na hora, direto no seu
              e-mail.
            </p>

            <button className="group mt-7 inline-flex items-center gap-3 bg-ink-900 px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-acid transition-colors hover:bg-ink-800">
              Ver todas as ofertas
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink-900/70">
              Termina em
            </span>
            <div className="flex items-center gap-2">
              {[
                { v: h, l: 'horas' },
                { v: m, l: 'min' },
                { v: s, l: 'seg' },
              ].map((u, i) => (
                <div key={u.l} className="flex items-center gap-2">
                  <div className="flex flex-col items-center bg-ink-900 px-4 py-3 sm:px-5">
                    <span className="font-display text-3xl font-black tabular-nums text-acid sm:text-4xl">
                      {u.v}
                    </span>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/50">
                      {u.l}
                    </span>
                  </div>
                  {i < 2 && (
                    <span className="font-display text-2xl font-black text-ink-900">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Grade de ofertas (card padrão do site) ===== */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {winterDeals.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </div>
    </section>
  );
}

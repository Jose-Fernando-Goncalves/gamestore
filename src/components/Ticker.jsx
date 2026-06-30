const items = [
  'LANÇAMENTOS DA SEMANA',
  'CHAVES NA HORA',
  'PRÉ-VENDA ABERTA',
  'CASHBACK DE 5%',
  'SUPORTE 24/7',
];

export default function Ticker() {
  return (
    <div className="relative z-30 flex overflow-hidden border-y border-white/10 bg-acid py-2.5">
      <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink-900"
          >
            {t}
            <span className="text-base leading-none">✦</span>
          </span>
        ))}
      </div>
      <div
        className="flex shrink-0 animate-marquee items-center gap-8 pr-8"
        aria-hidden
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink-900"
          >
            {t}
            <span className="text-base leading-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

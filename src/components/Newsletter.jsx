import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <section id="newsletter" className="relative overflow-hidden border-y border-white/10 bg-ink-800">
      {/* Brilho ambiente */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-acid/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
          // Fique por dentro
        </span>
        <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tightest text-white sm:text-5xl">
          Promoções no seu e-mail
          <span className="text-acid">.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-sm text-chrome">
          Receba alertas de descontos, lançamentos e pré-vendas antes de todo
          mundo. Sem spam — só jogo bom.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full border border-white/15 bg-ink-900 py-3.5 pl-11 pr-4 font-body text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-acid"
            />
          </div>
          <button
            type="submit"
            className="clip-btn flex items-center justify-center gap-2 bg-acid px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-ink-900 transition-transform hover:scale-[1.03] active:scale-100"
          >
            {sent ? (
              <>
                <Check size={16} /> Inscrito!
              </>
            ) : (
              'Inscrever'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

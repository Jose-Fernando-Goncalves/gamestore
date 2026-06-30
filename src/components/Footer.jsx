import { Link } from 'react-router-dom';
import { Disc, MessageCircle, Send, Globe, ShieldCheck, Zap } from 'lucide-react';

// Cada link aponta para um destino real do app (catálogo, filtros, seções da
// home). Itens sem página própria nesta demo levam à home.
const g = (genero) => `/catalogo?genero=${encodeURIComponent(genero)}`;

const columns = [
  {
    title: 'Loja',
    links: [
      { label: 'Catálogo completo', to: '/catalogo' },
      { label: 'Promoções', to: '/catalogo?promo=1' },
      { label: 'Lançamentos', to: '/catalogo' },
      { label: 'Pré-vendas', to: '/catalogo' },
    ],
  },
  {
    title: 'Gêneros',
    links: [
      { label: 'Action RPG', to: g('Action RPG') },
      { label: 'Aventura', to: g('Aventura') },
      { label: 'Terror', to: g('Terror') },
      { label: 'FPS', to: g('FPS') },
      { label: 'Indie', to: g('Indie') },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de ajuda', to: '/' },
      { label: 'Reembolsos', to: '/' },
      { label: 'Status do sistema', to: '/' },
      { label: 'Fale conosco', to: '/#newsletter' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre a HALLOW', to: '/' },
      { label: 'Carreiras', to: '/' },
      { label: 'Imprensa', to: '/' },
      { label: 'Parcerias', to: '/' },
    ],
  },
];

const socials = [Disc, MessageCircle, Send, Globe];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="mx-auto max-w-[1500px] px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          {/* Marca */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center bg-acid font-display text-lg font-black text-ink-900">
                H
              </span>
              <span className="font-display text-xl font-extrabold tracking-tightest text-white">
                HALLOW
              </span>
            </div>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-chrome">
              Sua loja de jogos digitais. Chaves oficiais, entrega instantânea e
              os melhores preços do submundo de Night City ao Reino Intermédio.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-acid hover:text-acid"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-acid">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="font-body text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Selos */}
        <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
          <span className="flex items-center gap-2 font-mono text-xs text-chrome">
            <ShieldCheck size={16} className="text-acid" /> Pagamento 100% seguro
          </span>
          <span className="flex items-center gap-2 font-mono text-xs text-chrome">
            <Zap size={16} className="text-acid" /> Entrega instantânea de chaves
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            {['VISA', 'MASTER', 'PIX', 'BOLETO'].map((p) => (
              <span
                key={p}
                className="border border-white/15 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-white/50"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-mono text-xs text-white/35">
            © {new Date().getFullYear()} HALLOW Game Store. Projeto fictício.
          </p>
          <div className="flex justify-center gap-5 sm:justify-end">
            <a href="#" className="font-mono text-xs text-white/35 hover:text-white">
              Privacidade
            </a>
            <a href="#" className="font-mono text-xs text-white/35 hover:text-white">
              Termos
            </a>
            <a href="#" className="font-mono text-xs text-white/35 hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

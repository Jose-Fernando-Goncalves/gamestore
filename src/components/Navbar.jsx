import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Apenas links que levam a algum lugar real: Home, o catálogo, o catálogo já
// filtrado em promoções e a seção "Explore" (gêneros) da home.
const links = [
  { label: 'Home', to: '/' },
  { label: 'Loja', to: '/catalogo' },
  { label: 'Promoções', to: '/catalogo?promo=1' },
  { label: 'Gêneros', to: '/#explore' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { count, abrir } = useCart();
  const { autenticado, isAdmin, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-ink-900/80 backdrop-blur-xl'
          : 'border-b-0 bg-gradient-to-b from-ink-900/70 to-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center bg-acid font-display text-lg font-black text-ink-900 transition-transform duration-300 group-hover:rotate-[-8deg]">
            H
          </span>
          <span className="font-display text-xl font-extrabold tracking-tightest text-white">
            HALLOW
          </span>
        </Link>

        {/* Links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="group relative font-mono text-xs uppercase tracking-widest text-white/65 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-acid transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Ações */}
        <div className="flex items-center gap-1.5">
          <button
            className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-acid"
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>
          <button
            onClick={abrir}
            className="relative flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-acid"
            aria-label={`Carrinho (${count} ${count === 1 ? 'item' : 'itens'})`}
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center bg-signal px-1 font-mono text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          {isAdmin && (
            <Link
              to="/admin"
              className="ml-1 hidden items-center gap-2 border border-acid/40 px-3 py-2 font-mono text-xs uppercase tracking-wider text-acid transition-colors hover:bg-acid hover:text-ink-900 sm:flex"
              title="Painel admin"
            >
              <ShieldCheck size={14} />
              Admin
            </Link>
          )}
          {autenticado ? (
            <Link
              to="/conta"
              className="ml-1 hidden items-center gap-2 border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:border-acid hover:text-acid sm:flex"
            >
              <User size={14} />
              {user?.name?.split(' ')[0] || 'Conta'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-1 hidden items-center gap-2 border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:border-acid hover:text-acid sm:flex"
            >
              <User size={14} />
              Entrar
            </Link>
          )}
          <button
            className="flex h-9 w-9 items-center justify-center text-white/70 lg:hidden"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}

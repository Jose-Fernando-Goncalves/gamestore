import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LogOut,
  LogIn,
  Library,
  Receipt,
  ShieldCheck,
  Gamepad2,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { listOrders } from '../data/api';
import { fmtBRL } from '../data/games';
import GameCard from '../components/GameCard';

export default function Conta() {
  const { user, isAdmin, logout, autenticado } = useAuth();
  const { games: biblioteca, carregado: bibCarregada } = useLibrary();
  const [pedidos, setPedidos] = useState(null);

  // Pedidos só existem para quem está logado; convidado vê o CTA de login
  // (o render checa `autenticado` antes de ler `pedidos`).
  useEffect(() => {
    if (!autenticado) return undefined;
    let vivo = true;
    listOrders()
      .then((p) => vivo && setPedidos(p))
      .catch(() => vivo && setPedidos([]));
    return () => {
      vivo = false;
    };
  }, [autenticado]);

  return (
    <div className="min-h-screen bg-ink-900 pt-[68px]">
      {/* Cabeçalho da conta */}
      <header className="border-b border-white/10 bg-ink-800">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center bg-acid font-display text-2xl font-black text-ink-900">
              {(user?.name?.[0] || 'C').toUpperCase()}
            </span>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
                {autenticado ? '// Minha conta' : '// Visitante'}
              </span>
              <h1 className="mt-1 font-display text-3xl font-black tracking-tightest text-white">
                {user?.name || 'Convidado'}
              </h1>
              <p className="font-mono text-xs text-white/45">
                {user?.email || 'Resgatando jogos grátis sem login'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 border border-acid/40 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-acid transition-colors hover:bg-acid hover:text-ink-900"
              >
                <ShieldCheck size={14} /> Painel admin
              </Link>
            )}
            {autenticado ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 border border-white/15 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70 transition-colors hover:border-signal hover:text-signal"
              >
                <LogOut size={14} /> Sair
              </button>
            ) : (
              <Link
                to="/login"
                state={{ de: '/conta' }}
                className="flex items-center gap-2 border border-acid/40 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-acid transition-colors hover:bg-acid hover:text-ink-900"
              >
                <LogIn size={14} /> Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-6 py-10 sm:px-10 lg:px-16">
        {/* ===== Biblioteca ===== */}
        <Secao icon={Library} titulo="Minha biblioteca">
          {!bibCarregada ? (
            <Carregando />
          ) : biblioteca.length === 0 ? (
            <Vazio
              icon={Gamepad2}
              texto="Você ainda não tem jogos. Que tal explorar o catálogo?"
              cta={{ to: '/catalogo', label: 'Ver catálogo' }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {biblioteca.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          )}
        </Secao>

        {/* ===== Pedidos ===== */}
        <Secao icon={Receipt} titulo="Histórico de pedidos">
          {!autenticado ? (
            <Vazio
              icon={Package}
              texto="Entre para comprar jogos e ver seu histórico de pedidos."
              cta={{ to: '/login', label: 'Entrar' }}
            />
          ) : pedidos === null ? (
            <Carregando />
          ) : pedidos.length === 0 ? (
            <Vazio icon={Package} texto="Nenhum pedido por aqui ainda." />
          ) : (
            <div className="flex flex-col gap-3">
              {pedidos.map((p) => (
                <Pedido key={p.id} pedido={p} />
              ))}
            </div>
          )}
        </Secao>
      </div>
    </div>
  );
}

function Pedido({ pedido }) {
  const data = new Date(pedido.createdAt?.replace(' ', 'T') + 'Z');
  const quando = isNaN(data) ? pedido.createdAt : data.toLocaleString('pt-BR');
  return (
    <div className="border border-white/10 bg-ink-800 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-bold text-white">
            Pedido #{String(pedido.id).padStart(4, '0')}
          </span>
          <span className="bg-acid/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-acid">
            {pedido.status}
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
          {quando}
        </span>
      </div>
      <ul className="mt-3 divide-y divide-white/5">
        {pedido.items.map((it) => (
          <li
            key={it.id}
            className="flex items-center justify-between py-2 font-body text-sm text-white/75"
          >
            <span className="truncate">{it.title}</span>
            <span className="font-mono text-white/55">
              {it.price === 0 ? 'Gratuito' : fmtBRL(it.price)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="font-mono text-xs uppercase tracking-widest text-white/45">
          Total
        </span>
        <span className="font-display text-lg font-black text-white">
          {fmtBRL(pedido.total)}
        </span>
      </div>
    </div>
  );
}

function Secao({ icon: Icone, titulo, children }) {
  return (
    <section className="mt-4 first:mt-0 [&+&]:mt-12">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center bg-acid/15 text-acid">
          <Icone size={15} />
        </span>
        <h2 className="font-display text-xl font-extrabold tracking-tight text-white">
          {titulo}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function Carregando() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[460/215] animate-pulse border border-white/10 bg-ink-700"
        />
      ))}
    </div>
  );
}

function Vazio({ icon: Icone, texto, cta }) {
  return (
    <div className="flex flex-col items-center gap-4 border border-dashed border-white/15 bg-ink-800 py-14 text-center">
      <Icone size={36} className="text-white/20" />
      <p className="font-mono text-sm text-chrome">{texto}</p>
      {cta && (
        <Link
          to={cta.to}
          className="clip-btn bg-acid px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-ink-900"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

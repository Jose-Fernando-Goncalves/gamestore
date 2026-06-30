import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Check,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../data/api';
import { fmtBRL } from '../data/games';

// Gaveta lateral do carrinho — desliza pela direita sobre o site.
export default function CartDrawer() {
  const { items, aberto, fechar, total, count, remove, setQty, clear } = useCart();
  const { autenticado } = useAuth();
  const navigate = useNavigate();
  const [finalizado, setFinalizado] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  // Trava o scroll do fundo enquanto a gaveta está aberta.
  useEffect(() => {
    if (!aberto) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [aberto, fechar]);

  // Reseta a tela de "compra concluída" ao reabrir.
  useEffect(() => {
    if (aberto) {
      setFinalizado(false);
      setErro('');
    }
  }, [aberto]);

  const finalizar = async () => {
    if (!items.length || processando) return;
    setErro('');

    // Checkout exige login: leva à tela de login mantendo o carrinho.
    if (!autenticado) {
      fechar();
      navigate('/login', { state: { de: '/catalogo' } });
      return;
    }

    setProcessando(true);
    try {
      await createOrder(items.map((i) => ({ id: i.id, qty: i.qty })));
      setFinalizado(true);
      clear();
    } catch (err) {
      setErro(err.message || 'Não foi possível concluir a compra.');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <>
      {/* Fundo escuro clicável */}
      <div
        onClick={fechar}
        aria-hidden
        className={`fixed inset-0 z-[89] bg-ink-900/70 backdrop-blur-sm transition-opacity duration-300 ${
          aberto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Painel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        className={`fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-800 shadow-[0_0_60px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out ${
          aberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabeçalho */}
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="flex items-center gap-2.5 font-display text-lg font-bold uppercase tracking-wide text-white">
            <ShoppingCart size={18} className="text-acid" /> Carrinho
            {count > 0 && (
              <span className="font-mono text-sm text-acid">({count})</span>
            )}
          </h2>
          <button
            onClick={fechar}
            aria-label="Fechar carrinho"
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-signal hover:text-signal"
          >
            <X size={16} />
          </button>
        </header>

        {finalizado ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-acid text-ink-900">
              <Check size={30} />
            </span>
            <h3 className="font-display text-xl font-bold text-white">
              Compra concluída!
            </h3>
            <p className="max-w-xs font-body text-sm text-chrome">
              Suas chaves foram enviadas para o seu e-mail. Bom jogo! 🎮
            </p>
            <button
              onClick={fechar}
              className="clip-btn mt-2 bg-acid px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-ink-900"
            >
              Continuar comprando
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingCart size={40} className="text-white/20" />
            <p className="font-mono text-sm text-chrome">
              Seu carrinho está vazio.
            </p>
            <button
              onClick={fechar}
              className="font-mono text-xs uppercase tracking-widest text-acid hover:underline"
            >
              Explorar jogos
            </button>
          </div>
        ) : (
          <>
            {/* Itens */}
            <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
              <ul className="flex flex-col gap-4">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="flex gap-3 border border-white/10 bg-ink-700 p-3"
                  >
                    <div
                      className="relative aspect-[460/215] w-28 shrink-0 overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${it.accent}22, #0b0b11 70%)`,
                      }}
                    >
                      {it.cover && (
                        <img
                          src={it.cover}
                          alt={it.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-display text-sm font-bold text-white">
                          {it.title}
                        </h3>
                        <button
                          onClick={() => remove(it.id)}
                          aria-label={`Remover ${it.title}`}
                          className="shrink-0 text-white/35 transition-colors hover:text-signal"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {it.discount > 0 && (
                        <span className="font-mono text-[10px] text-white/35 line-through">
                          {fmtBRL(it.oldPrice)}
                        </span>
                      )}
                      <span className="font-display text-base font-bold text-acid">
                        {it.price === 0 ? 'Gratuito' : fmtBRL(it.price)}
                      </span>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <Stepper
                          qty={it.qty}
                          onMinus={() => setQty(it.id, it.qty - 1)}
                          onPlus={() => setQty(it.id, it.qty + 1)}
                        />
                        {it.qty > 1 && it.price > 0 && (
                          <span className="font-mono text-xs text-white/50">
                            {fmtBRL(it.price * it.qty)}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={clear}
                className="mt-4 font-mono text-[11px] uppercase tracking-widest text-white/40 transition-colors hover:text-signal"
              >
                Limpar carrinho
              </button>
            </div>

            {/* Rodapé */}
            <footer className="border-t border-white/10 px-6 py-5">
              {erro && (
                <div className="mb-3 flex items-center gap-2 border border-signal/40 bg-signal/10 px-3 py-2 font-mono text-[11px] text-signal">
                  <AlertCircle size={14} className="shrink-0" /> {erro}
                </div>
              )}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-white/50">
                  Total
                </span>
                <span className="font-display text-2xl font-black text-white">
                  {fmtBRL(total)}
                </span>
              </div>
              <button
                onClick={finalizar}
                disabled={processando}
                className="clip-btn flex w-full items-center justify-center gap-2 bg-acid py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              >
                {processando ? (
                  'Processando…'
                ) : autenticado ? (
                  <>
                    Finalizar compra <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <LogIn size={16} /> Entrar para comprar
                  </>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/40">
                <Check size={13} className="text-acid" /> Ativação imediata na conta
                HALLOW
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function Stepper({ qty, onMinus, onPlus }) {
  return (
    <div className="flex items-center border border-white/15">
      <button
        onClick={onMinus}
        aria-label="Diminuir quantidade"
        className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-acid"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center font-mono text-sm text-white">{qty}</span>
      <button
        onClick={onPlus}
        aria-label="Aumentar quantidade"
        className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-white/5 hover:text-acid"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// Estado global do carrinho de compras. Os itens são persistidos no mesmo
// armazenamento assíncrono usado para os jogos (localStorage, no espírito do
// AsyncStorage), então o carrinho sobrevive a recarregamentos da página.

import { createContext, useContext, useEffect, useState } from 'react';
import { coverSources } from '../data/catalog';
import { storage } from '../data/gameStore';

const CartContext = createContext(null);
const CART_KEY = 'hallow:cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [aberto, setAberto] = useState(false);
  const [carregado, setCarregado] = useState(false);

  // Carrega o carrinho persistido uma única vez.
  useEffect(() => {
    let vivo = true;
    storage.getItem(CART_KEY).then((raw) => {
      if (!vivo) return;
      try {
        const lista = raw ? JSON.parse(raw) : [];
        setItems(Array.isArray(lista) ? lista : []);
      } catch {
        setItems([]);
      }
      setCarregado(true);
    });
    return () => {
      vivo = false;
    };
  }, []);

  // Persiste a cada alteração (só depois do carregamento inicial, para não
  // sobrescrever o que estava salvo com o estado vazio do primeiro render).
  useEffect(() => {
    if (!carregado) return;
    storage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, carregado]);

  // Adiciona um jogo (ou soma a quantidade se já estiver no carrinho) e abre a
  // gaveta para dar feedback imediato.
  const add = (game, qtd = 1) => {
    setItems((cur) => {
      const existe = cur.find((i) => i.id === game.id);
      if (existe) {
        return cur.map((i) =>
          i.id === game.id ? { ...i, qty: i.qty + qtd } : i
        );
      }
      return [
        {
          id: game.id,
          title: game.title,
          price: game.price,
          oldPrice: game.oldPrice,
          discount: game.discount || 0,
          accent: game.accent || '#d6ff3f',
          cover: coverSources(game)[0],
          qty: qtd,
        },
        ...cur,
      ];
    });
    setAberto(true);
  };

  const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));

  // Define a quantidade; 0 ou menos remove o item.
  const setQty = (id, qty) =>
    setItems((cur) =>
      cur.flatMap((i) =>
        i.id !== id ? [i] : qty <= 0 ? [] : [{ ...i, qty }]
      )
    );

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        aberto,
        count,
        total,
        add,
        remove,
        setQty,
        clear,
        abrir: () => setAberto(true),
        fechar: () => setAberto(false),
        alternar: () => setAberto((v) => !v),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}

// Biblioteca do usuário — fonte única de "quais jogos eu possuo".
//
// Convidado (não logado): resgata jogos GRÁTIS (preço 0) e os guarda no mesmo
// armazenamento local do carrinho (localStorage), então a biblioteca sobrevive a
// recarregamentos. Jogos PAGOS não entram por aqui — vão pelo carrinho/checkout,
// que exige login.
//
// Ao logar: os grátis montados como convidado são enviados ao servidor
// (claimLibrary) e a lista local é limpa — daí em diante o servidor é a verdade.

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { listLibrary, claimLibrary } from '../data/api';
import { normalizeGame } from '../data/library';
import { storage } from '../data/gameStore';

const LibraryContext = createContext(null);
const GUEST_KEY = 'hallow:guest-library';

const parse = (raw) => {
  try {
    const lista = raw ? JSON.parse(raw) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
};

export function LibraryProvider({ children }) {
  const { autenticado } = useAuth();
  const [games, setGames] = useState([]); // jogos possuídos (shape do catálogo)
  const [carregado, setCarregado] = useState(false);

  // Carrega a biblioteca conforme o estado de autenticação.
  useEffect(() => {
    let vivo = true;
    (async () => {
      if (autenticado) {
        // Mescla os grátis resgatados como convidado e zera a lista local.
        const locais = parse(await storage.getItem(GUEST_KEY));
        if (locais.length) {
          try {
            await claimLibrary(locais.map((g) => g.id));
          } catch {
            /* falha de merge não bloqueia o carregamento */
          }
          await storage.removeItem(GUEST_KEY);
        }
        try {
          const lista = await listLibrary();
          if (vivo) setGames(lista.map(normalizeGame));
        } catch {
          if (vivo) setGames([]);
        }
      } else {
        // Convidado: biblioteca puramente local.
        if (vivo) setGames(parse(await storage.getItem(GUEST_KEY)));
      }
      if (vivo) setCarregado(true);
    })();
    return () => {
      vivo = false;
    };
  }, [autenticado]);

  const isOwned = (id) => games.some((g) => g.id === id);

  // Resgata um jogo grátis. Pagos e já possuídos são ignorados.
  const claim = async (game) => {
    if (!game || game.price !== 0 || isOwned(game.id)) return;
    if (autenticado) {
      try {
        const lista = await claimLibrary([game.id]);
        setGames(lista.map(normalizeGame));
      } catch {
        /* noop */
      }
    } else {
      const novos = [game, ...games];
      setGames(novos);
      storage.setItem(GUEST_KEY, JSON.stringify(novos));
    }
  };

  return (
    <LibraryContext.Provider value={{ games, carregado, isOwned, claim }}>
      {children}
    </LibraryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary precisa estar dentro de <LibraryProvider>');
  return ctx;
}

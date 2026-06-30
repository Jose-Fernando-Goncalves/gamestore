// Contexto leve que conecta qualquer card à página de detalhes em overlay.
// `abrir(game)` guarda o objeto do jogo clicado (de qualquer seção do site);
// o componente <GameDetails/> (renderizado uma única vez no App) observa esse
// objeto e sobe o overlay com os dados daquele card.

import { createContext, useContext, useState } from 'react';

const GameDetailsContext = createContext(null);

export function GameDetailsProvider({ children }) {
  const [jogo, setJogo] = useState(null);

  const abrir = (game) => setJogo(game);
  const fechar = () => setJogo(null);

  return (
    <GameDetailsContext.Provider value={{ jogo, abrir, fechar }}>
      {children}
    </GameDetailsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGameDetails() {
  const ctx = useContext(GameDetailsContext);
  if (!ctx)
    throw new Error('useGameDetails precisa estar dentro de <GameDetailsProvider>');
  return ctx;
}

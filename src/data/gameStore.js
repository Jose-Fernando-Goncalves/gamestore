// ============================================================================
// gameStore — camada de acesso aos jogos.
// ----------------------------------------------------------------------------
// Antes isto era um mock sobre localStorage; agora conversa com a API Node
// (server/). As ASSINATURAS continuam idênticas (Promises), então quem consome
// (Catálogo, painel admin) não precisou mudar — era exatamente o ponto de
// extensão previsto desde o início.
//
// Cada jogo vindo da API passa por `normalizeGame` (mesmo `make()` da library),
// que deriva capa/trailer/desconto — nunca cravamos URLs de capa nos componentes.
//
// O `storage` (wrapper assíncrono sobre o localStorage) permanece aqui porque o
// carrinho (CartContext) ainda o usa para persistir localmente.
// ============================================================================

import { normalizeGame } from './library';
import { listGames, createGame, deleteGame } from './api';

// Wrapper assíncrono sobre o localStorage (usado pelo carrinho).
export const storage = {
  getItem: (key) => Promise.resolve(globalThis.localStorage?.getItem(key) ?? null),
  setItem: (key, value) =>
    Promise.resolve(globalThis.localStorage?.setItem(key, value)),
  removeItem: (key) => Promise.resolve(globalThis.localStorage?.removeItem(key)),
};

// Catálogo completo, normalizado para o shape que os componentes esperam.
export async function getAllGames() {
  const lista = await listGames();
  return lista.map(normalizeGame);
}

// Cadastra um novo jogo (rota admin). Retorna o jogo já normalizado.
export async function addGame(dados) {
  const novo = await createGame(dados);
  return normalizeGame(novo);
}

// Remove um jogo (rota admin).
export async function removeGame(id) {
  await deleteGame(id);
}

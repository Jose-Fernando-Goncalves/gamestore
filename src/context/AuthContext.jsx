// Estado global de autenticação. Guarda o usuário logado e o token JWT,
// persistindo o token no localStorage (via api.js). No mount, se houver token,
// revalida com o servidor (/auth/me) para recuperar os dados do usuário.

import { createContext, useContext, useEffect, useState } from 'react';
import {
  authLogin,
  authRegister,
  authMe,
  getToken,
  setToken,
} from '../data/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Só nasce "carregando" se houver token a revalidar (evita setState no effect).
  const [carregando, setCarregando] = useState(() => !!getToken());

  // Ao abrir o app: se há token salvo, busca o usuário correspondente.
  useEffect(() => {
    let vivo = true;
    if (!getToken()) return undefined;
    authMe()
      .then((r) => vivo && setUser(r.user))
      .catch(() => {
        // Token inválido/expirado: limpa.
        setToken(null);
        if (vivo) setUser(null);
      })
      .finally(() => vivo && setCarregando(false));
    return () => {
      vivo = false;
    };
  }, []);

  // Guarda token + usuário após login/registro bem-sucedidos.
  const aplicarSessao = (resp) => {
    setToken(resp.token);
    setUser(resp.user);
    return resp.user;
  };

  const login = async (email, senha) => aplicarSessao(await authLogin(email, senha));
  const register = async (nome, email, senha) =>
    aplicarSessao(await authRegister(nome, email, senha));

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        carregando,
        autenticado: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}

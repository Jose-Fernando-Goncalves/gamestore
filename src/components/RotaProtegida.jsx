// Guarda de rota. Exige login (e opcionalmente o papel de admin). Enquanto o
// AuthContext revalida o token, mostra um estado de carregamento; sem permissão,
// redireciona para o login (guardando a origem em `state.de`) ou para a home.

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RotaProtegida({ children, somenteAdmin = false }) {
  const { autenticado, isAdmin, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 pt-[68px]">
        <span className="font-mono text-xs uppercase tracking-widest text-white/40">
          Carregando…
        </span>
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  }

  if (somenteAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.de || '/conta';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await login(email, senha);
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(err.message || 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthShell
      titulo="Entrar"
      sub="// Acesse sua conta HALLOW"
      rodape={
        <>
          Ainda não tem conta?{' '}
          <Link to="/registro" className="text-acid hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={enviar} className="flex flex-col gap-4">
        {erro && <Erro mensagem={erro} />}
        <Campo
          icon={Mail}
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <Campo
          icon={Lock}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={setSenha}
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={enviando}
          className="clip-btn mt-2 flex items-center justify-center gap-2 bg-acid py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <LogIn size={16} /> {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  );
}

// ---- Componentes reutilizados pelas telas de auth (também por Registro) ----

export function AuthShell({ titulo, sub, children, rodape }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6 pt-[68px]">
      <div className="w-full max-w-md">
        <div className="border border-white/10 bg-ink-800 p-8">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-acid">
            {sub}
          </span>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tightest text-white">
            {titulo}
          </h1>
          <div className="mt-7">{children}</div>
        </div>
        <p className="mt-5 text-center font-mono text-xs uppercase tracking-wider text-white/45">
          {rodape}
        </p>
      </div>
    </div>
  );
}

export function Campo({ icon: Icone, type, placeholder, value, onChange, autoComplete }) {
  return (
    <div className="relative">
      <Icone
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
      />
      <input
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-white/15 bg-ink-700 py-3 pl-11 pr-4 font-body text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-acid/60"
      />
    </div>
  );
}

export function Erro({ mensagem }) {
  return (
    <div className="flex items-center gap-2 border border-signal/40 bg-signal/10 px-3 py-2.5 font-mono text-xs text-signal">
      <AlertCircle size={15} className="shrink-0" /> {mensagem}
    </div>
  );
}

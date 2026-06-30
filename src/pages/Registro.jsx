import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthShell, Campo, Erro } from './Login';

export default function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro('');
    if (senha.length < 6) {
      setErro('A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    setEnviando(true);
    try {
      await register(nome, email, senha);
      navigate('/conta', { replace: true });
    } catch (err) {
      setErro(err.message || 'Não foi possível criar a conta.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthShell
      titulo="Criar conta"
      sub="// Junte-se à HALLOW"
      rodape={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="text-acid hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={enviar} className="flex flex-col gap-4">
        {erro && <Erro mensagem={erro} />}
        <Campo
          icon={User}
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={setNome}
          autoComplete="name"
        />
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
          placeholder="Senha (mín. 6 caracteres)"
          value={senha}
          onChange={setSenha}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={enviando}
          className="clip-btn mt-2 flex items-center justify-center gap-2 bg-acid py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <UserPlus size={16} /> {enviando ? 'Criando…' : 'Criar conta'}
        </button>
      </form>
    </AuthShell>
  );
}

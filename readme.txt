================================================================================
  HALLOW - LOJA DE JOGOS (projeto full-stack)
================================================================================

HALLOW e uma loja de jogos ficticia, feita como projeto de portfolio. Reune uma
vitrine de alto acabamento (hero cinematografico, carrosseis de trailers, secao
retro/medieval tematica, animacoes) com um app de produto real: autenticacao de
usuario/admin, catalogo, carrinho, biblioteca e pedidos.

Toda a interface e os textos estao em portugues do Brasil.


--------------------------------------------------------------------------------
  STACK
--------------------------------------------------------------------------------

  Front : React 19, Vite, Tailwind 3, React Router, lucide-react
  Back  : Node + Express, SQLite (better-sqlite3), JWT, bcryptjs

Pre-requisitos: Node 20+ (testado no Node 24).


--------------------------------------------------------------------------------
  DOIS MODOS DE FUNCIONAMENTO
--------------------------------------------------------------------------------

O front tem uma camada de dados que alterna entre o backend real e um mock em
localStorage, controlada pela flag de build VITE_MOCK:

  1) LOCAL / FULL-STACK  (para clonar e testar o backend de verdade)
     - Comando : npm run dev:full
     - Dados   : API Express + SQLite reais (auth/JWT, admin, biblioteca, pedidos)
     - A flag fica desligada em desenvolvimento, entao tudo bate na API real.

  2) DEMO / VERCEL  (site publico, sem backend)
     - Comando : npm run build  (usa o arquivo .env.production com VITE_MOCK=true)
     - Dados   : mock em localStorage (src/data/apiMock.js); nenhuma chamada de rede.
     - Cada visitante tem os proprios dados, resetaveis limpando o localStorage.


--------------------------------------------------------------------------------
  RODANDO LOCALMENTE (full-stack)
--------------------------------------------------------------------------------

  1. Instale as dependencias:
       npm install

  2. Configure o ambiente (copie o exemplo e ajuste o JWT_SECRET):
       cp .env.example .env

  3. Suba front + back juntos:
       npm run dev:full

  Em desenvolvimento o Vite faz proxy de /api -> http://localhost:3001, entao nao
  ha CORS no navegador. Abra o endereco que o Vite imprimir (normalmente
  http://localhost:5173).


--------------------------------------------------------------------------------
  SCRIPTS
--------------------------------------------------------------------------------

  npm run dev          so o front (Vite)
  npm run dev:server   so a API (Node, com --watch)
  npm run dev:full     front + API juntos
  npm run seed         popula o banco (catalogo + admin) manualmente
  npm run build        build de producao do front em dist/ (modo mock)
  npm run preview      serve o dist/ ja buildado
  npm run lint         ESLint


--------------------------------------------------------------------------------
  VARIAVEIS DE AMBIENTE (.env)
--------------------------------------------------------------------------------

  PORT=3001
  JWT_SECRET=...                  troque por um valor longo e aleatorio
  ADMIN_NAME=Admin HALLOW
  ADMIN_EMAIL=admin@hallow.gg
  ADMIN_PASSWORD=admin123

  Gere um segredo forte com:
    node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

  O arquivo .env real NAO vai para o Git (esta no .gitignore). O .env.production
  (commitado) so define VITE_MOCK=true e nao guarda segredo nenhum.


--------------------------------------------------------------------------------
  BANCO DE DADOS
--------------------------------------------------------------------------------

  SQLite em server/data/hallow.db (gitignored). No primeiro boot, o servidor roda
  o seed automaticamente: importa o catalogo (~50 jogos) e cria um usuario admin.
  Para recriar do zero, apague o arquivo .db e rode: npm run seed


--------------------------------------------------------------------------------
  USUARIO ADMIN (demo)
--------------------------------------------------------------------------------

  E-mail : admin@hallow.gg
  Senha  : admin123

  (Troque no .env antes do primeiro seed em uso real.) O admin abre o painel em
  /admin, com CRUD do catalogo (criar / editar / remover jogos) e metricas.


--------------------------------------------------------------------------------
  API (rotas)
--------------------------------------------------------------------------------

  POST   /api/auth/register   publico   cria conta, devolve JWT
  POST   /api/auth/login      publico   login, devolve JWT
  GET    /api/auth/me         logado    dados do usuario do token
  GET    /api/games           publico   catalogo
  GET    /api/games/:id       publico   detalhe
  POST   /api/games           admin     cria jogo
  PUT    /api/games/:id       admin     edita jogo
  DELETE /api/games/:id       admin     remove jogo
  POST   /api/orders          logado    finaliza compra (checkout mockado)
  GET    /api/orders          logado    historico de pedidos
  GET    /api/library         logado    jogos que o usuario possui
  POST   /api/library/claim   logado    resgata jogos gratis (preco 0)

  Regras de acesso: navegar e resgatar jogos gratis e livre (a biblioteca de
  convidado vive no localStorage); apenas a compra paga exige login.


--------------------------------------------------------------------------------
  ESTRUTURA
--------------------------------------------------------------------------------

  src/             front React
    components/    componentes de apresentacao
    pages/         paginas (Home, Catalogo, Login, Registro, Conta, Admin)
    context/       estado global (Auth, Cart, Library, GameDetails)
    data/          dados + cliente da API (api.js) e o mock (apiMock.js)
    hooks/         hooks reutilizaveis
  server/          API Express
    index.js       bootstrap + rotas
    db.js          conexao SQLite + schema
    auth.js        bcrypt + JWT + middlewares
    seed.js        catalogo + admin inicial
    routes/        auth, games, orders, library

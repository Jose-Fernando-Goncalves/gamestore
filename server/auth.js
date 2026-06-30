// ============================================================================
// Autenticação — hashing de senha (bcrypt) + JWT + middlewares de proteção.
// ============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// O segredo NUNCA fica no código em produção — vem do .env (veja .env.example).
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-troque-no-.env';
export const JWT_EXPIRES_IN = '7d';

// ---------------------------------------------------------------------------
// Senhas (bcrypt) — já implementado, pode usar à vontade.
// ---------------------------------------------------------------------------

// Gera o hash da senha para guardar no banco (nunca salve a senha em texto puro).
export function hashPassword(senha) {
  return bcrypt.hash(senha, 10);
}

// Compara a senha digitada no login com o hash salvo. Retorna Promise<boolean>.
export function comparePassword(senha, hash) {
  return bcrypt.compare(senha, hash);
}

// ===========================================================================
// JWT — assina um token no login/registro e o verifica nas rotas protegidas.
// O `payload` que o resto do código espera é { id, role }.
// ===========================================================================

// Recebe { id, role } e devolve a string do token assinado. O `expiresIn`
// injeta os claims iat/exp — o verify abaixo checa a expiração sozinho.
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Recebe a string do token e devolve o payload { id, role } decodificado.
// Lança erro se o token for inválido/expirado (o requireAuth trata com try/catch).
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// ===========================================================================
// Middlewares — já prontos, usam o verifyToken() acima.
// ===========================================================================

// Exige um token válido. Popula req.user = { id, role } para as rotas seguintes.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ erro: 'Autenticação necessária.' });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

// Exige que o usuário autenticado seja admin. Use SEMPRE depois de requireAuth.
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
  }
  next();
}

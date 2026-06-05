import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set. Add it to your .env file.');
  }
  return secret;
};

const base64url = (input) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const fromBase64url = (input) =>
  Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();

const sign = (data) =>
  crypto
    .createHmac('sha256', getSecret())
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

// Create a compact HMAC-signed token: base64url(payload).signature
export const createToken = (payload) => {
  const body = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const encoded = base64url(JSON.stringify(body));
  return `${encoded}.${sign(encoded)}`;
};

// Verify a token's signature and expiry. Returns the payload or null.
export const verifyToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  // Constant-time comparison to avoid timing attacks.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromBase64url(encoded));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const buildSessionCookie = (token) => {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE}`,
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
};

export const buildClearCookie = () => {
  const parts = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
};

// Read and verify the admin session from an API request.
export const getSessionFromReq = (req) => {
  const token = req.cookies?.[COOKIE_NAME];
  return verifyToken(token);
};

// Validate submitted credentials against env-configured admin account.
export const validateCredentials = (username, password) => {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPass) {
    throw new Error('ADMIN_USERNAME / ADMIN_PASSWORD are not set in .env');
  }
  // Constant-time comparison for both fields.
  const userOk =
    Buffer.byteLength(username || '') === Buffer.byteLength(adminUser) &&
    crypto.timingSafeEqual(
      Buffer.from(username || ''),
      Buffer.from(adminUser)
    );
  const passOk =
    Buffer.byteLength(password || '') === Buffer.byteLength(adminPass) &&
    crypto.timingSafeEqual(
      Buffer.from(password || ''),
      Buffer.from(adminPass)
    );
  return userOk && passOk;
};

// Higher-order wrapper that guards an API handler behind a valid admin session.
export const requireAdmin = (handler) => async (req, res) => {
  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  req.admin = session;
  return handler(req, res);
};

export { COOKIE_NAME };

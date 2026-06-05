import {
  validateCredentials,
  createToken,
  buildSessionCookie,
} from '../../../lib/auth';

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body;
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ msg: 'Only POST requests are allowed' });
  }

  const body = parseBody(req);
  if (body === null) return res.status(400).json({ msg: 'Invalid JSON body' });

  const { username, password } = body;
  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password are required' });
  }

  try {
    if (!validateCredentials(username, password)) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server auth misconfigured' });
  }

  const token = createToken({ sub: username, role: 'admin' });
  res.setHeader('Set-Cookie', buildSessionCookie(token));
  return res.status(200).json({ msg: 'Logged in', user: { username } });
}

import { getSessionFromReq } from '../../../lib/auth';

export default function handler(req, res) {
  const session = getSessionFromReq(req);
  if (!session) return res.status(401).json({ authenticated: false });
  return res.status(200).json({
    authenticated: true,
    user: { username: session.sub, role: session.role },
  });
}

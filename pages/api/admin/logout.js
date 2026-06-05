import { buildClearCookie } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ msg: 'Only POST requests are allowed' });
  }
  res.setHeader('Set-Cookie', buildClearCookie());
  return res.status(200).json({ msg: 'Logged out' });
}

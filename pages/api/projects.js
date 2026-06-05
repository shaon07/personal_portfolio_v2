import {
  getProjects,
  getPaginatedProjects,
  createProject,
} from '../../lib/projects';
import { getSessionFromReq } from '../../lib/auth';

// Re-exported so getStaticProps in pages/projects.jsx keeps working.
export { getProjects };

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
  // GET /api/projects — public list.
  // With ?page= or ?limit=, returns a paginated envelope; otherwise the full array.
  if (req.method === 'GET') {
    const { page, limit } = req.query;
    if (page !== undefined || limit !== undefined) {
      return res.status(200).json(getPaginatedProjects({ page, limit }));
    }
    return res.status(200).json(getProjects());
  }

  // POST /api/projects — create a project (admin only).
  if (req.method === 'POST') {
    if (!getSessionFromReq(req)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const body = parseBody(req);
    if (body === null) {
      return res.status(400).json({ msg: 'Invalid JSON body' });
    }
    const { project, error, readOnly } = createProject(body);
    if (readOnly) return res.status(503).json({ msg: error });
    if (error) return res.status(400).json({ msg: error });
    return res.status(201).json(project);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ msg: `Method ${req.method} not allowed` });
}

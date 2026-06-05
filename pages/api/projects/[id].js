import {
  getProjectById,
  updateProject,
  deleteProject,
} from '../../../lib/projects';
import { getSessionFromReq } from '../../../lib/auth';

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
  const { id } = req.query;

  // GET /api/projects/:id — public read of a single project.
  if (req.method === 'GET') {
    const project = getProjectById(id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    return res.status(200).json(project);
  }

  // All mutations require an admin session.
  if (!getSessionFromReq(req)) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // PUT/PATCH /api/projects/:id — update.
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const body = parseBody(req);
    if (body === null) {
      return res.status(400).json({ msg: 'Invalid JSON body' });
    }
    const { project, error, notFound } = updateProject(id, body);
    if (notFound) return res.status(404).json({ msg: error });
    if (error) return res.status(400).json({ msg: error });
    return res.status(200).json(project);
  }

  // DELETE /api/projects/:id — remove.
  if (req.method === 'DELETE') {
    const { project, error, notFound } = deleteProject(id);
    if (notFound) return res.status(404).json({ msg: error });
    if (error) return res.status(400).json({ msg: error });
    return res.status(200).json(project);
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
  return res.status(405).json({ msg: `Method ${req.method} not allowed` });
}

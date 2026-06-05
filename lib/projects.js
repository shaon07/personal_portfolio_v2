import fs from 'fs';
import path from 'path';

// Single source of truth for the projects data file.
const DATA_FILE = path.join(process.cwd(), 'pages', 'api', 'projects.json');

const readAll = () => {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
};

const writeAll = (projects) => {
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(projects, null, 2)}\n`, 'utf-8');
};

const nextId = (projects) =>
  projects.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;

// Normalize/validate an incoming project payload. Returns { value, error }.
const sanitize = (input) => {
  if (!input || typeof input !== 'object') {
    return { error: 'Invalid request body' };
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const description =
    typeof input.description === 'string' ? input.description.trim() : '';
  const image = typeof input.image === 'string' ? input.image.trim() : '';
  const demo = typeof input.demo === 'string' ? input.demo.trim() : '';
  const source_code =
    typeof input.source_code === 'string' ? input.source_code.trim() : '';

  let tags = [];
  if (Array.isArray(input.tags)) {
    tags = input.tags.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof input.tags === 'string') {
    tags = input.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  if (!name) return { error: 'Name is required' };
  if (!description) return { error: 'Description is required' };
  if (!image) return { error: 'Image URL is required' };
  if (!demo) return { error: 'Demo URL is required' };

  const value = { name, image, description, tags, demo };
  if (source_code) value.source_code = source_code;
  return { value };
};

export const getProjects = () => readAll();

// Paginated view over the projects list.
// Returns { data, pagination: { page, limit, total, totalPages, hasNext, hasPrev } }.
export const getPaginatedProjects = ({ page = 1, limit = 10 } = {}) => {
  const all = readAll();
  const total = all.length;

  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.max(1, Math.min(totalPages, Number(page) || 1));

  const start = (safePage - 1) * safeLimit;
  const data = all.slice(start, start + safeLimit);

  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
};

export const getProjectById = (id) => {
  const projects = readAll();
  return projects.find((p) => String(p.id) === String(id)) || null;
};

export const createProject = (input) => {
  const { value, error } = sanitize(input);
  if (error) return { error };

  const projects = readAll();
  const project = { id: nextId(projects), ...value };
  projects.push(project);
  writeAll(projects);
  return { project };
};

export const updateProject = (id, input) => {
  const { value, error } = sanitize(input);
  if (error) return { error };

  const projects = readAll();
  const index = projects.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return { error: 'Project not found', notFound: true };

  const updated = { ...projects[index], ...value };
  // source_code is optional: drop it if cleared.
  if (!value.source_code) delete updated.source_code;
  projects[index] = updated;
  writeAll(projects);
  return { project: updated };
};

export const deleteProject = (id) => {
  const projects = readAll();
  const index = projects.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return { error: 'Project not found', notFound: true };

  const [removed] = projects.splice(index, 1);
  writeAll(projects);
  return { project: removed };
};

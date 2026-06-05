import fs from 'fs';
import path from 'path';
import { list, put } from '@vercel/blob';
// Static import so seed data is always available as a last-resort fallback,
// even on a read-only/serverless filesystem.
import seedData from '../pages/api/projects.json';

// Local dev storage (writable filesystem).
const DATA_FILE = path.join(process.cwd(), 'pages', 'api', 'projects.json');
// Blob object key used in production.
const BLOB_KEY = 'projects.json';

// Use Vercel Blob whenever a token is configured; otherwise fall back to the
// local JSON file so development works with no external dependency.
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

const clone = (data) => JSON.parse(JSON.stringify(data));

/* ----------------------------- filesystem ------------------------------ */

const fsRead = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    return clone(seedData);
  }
};

const fsWrite = (projects) => {
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(projects, null, 2)}\n`, 'utf-8');
};

/* ------------------------------- blob ---------------------------------- */

const blobRead = async () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token });
    const match = blobs.find((b) => b.pathname === BLOB_KEY) || blobs[0];
    // Not seeded yet — return the bundled seed data. The first write creates it.
    if (!match) return clone(seedData);

    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) return clone(seedData);
    return res.json();
  } catch (err) {
    // Never let a read crash the page — degrade to bundled seed data.
    console.error('[projects] blob read failed, using seed data:', err.message);
    return clone(seedData);
  }
};

const blobWrite = async (projects) => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  await put(BLOB_KEY, `${JSON.stringify(projects, null, 2)}\n`, {
    access: 'public',
    token,
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
};

/* --------------------------- storage facade ---------------------------- */

const readAll = async () => (useBlob() ? blobRead() : fsRead());
const writeAll = async (projects) =>
  useBlob() ? blobWrite(projects) : fsWrite(projects);

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

export const getProjects = async () => readAll();

// Paginated view over the projects list.
// Returns { data, pagination: { page, limit, total, totalPages, hasNext, hasPrev } }.
export const getPaginatedProjects = async ({ page = 1, limit = 10 } = {}) => {
  const all = await readAll();
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

export const getProjectById = async (id) => {
  const projects = await readAll();
  return projects.find((p) => String(p.id) === String(id)) || null;
};

export const createProject = async (input) => {
  const { value, error } = sanitize(input);
  if (error) return { error };

  const projects = await readAll();
  const project = { id: nextId(projects), ...value };
  projects.push(project);
  try {
    await writeAll(projects);
  } catch (err) {
    return { error: err.message || 'Failed to save project' };
  }
  return { project };
};

export const updateProject = async (id, input) => {
  const { value, error } = sanitize(input);
  if (error) return { error };

  const projects = await readAll();
  const index = projects.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return { error: 'Project not found', notFound: true };

  const updated = { ...projects[index], ...value };
  // source_code is optional: drop it if cleared.
  if (!value.source_code) delete updated.source_code;
  projects[index] = updated;
  try {
    await writeAll(projects);
  } catch (err) {
    return { error: err.message || 'Failed to update project' };
  }
  return { project: updated };
};

export const deleteProject = async (id) => {
  const projects = await readAll();
  const index = projects.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return { error: 'Project not found', notFound: true };

  const [removed] = projects.splice(index, 1);
  try {
    await writeAll(projects);
  } catch (err) {
    return { error: err.message || 'Failed to delete project' };
  }
  return { project: removed };
};

import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSessionFromReq } from '../../lib/auth';
import { getProjects } from '../../lib/projects';
import styles from '../../styles/Admin.module.css';

const EMPTY_FORM = {
  name: '',
  image: '',
  description: '',
  tags: '',
  demo: '',
  source_code: '',
};

const toForm = (project) => ({
  name: project.name || '',
  image: project.image || '',
  description: project.description || '',
  tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
  demo: project.demo || '',
  source_code: project.source_code || '',
});

const AdminDashboard = ({ initialProjects, user }) => {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Client-side pagination derived from the in-memory list, clamped to bounds
  // so it stays valid through create/delete.
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = projects.slice(pageStart, pageStart + pageSize);

  const goToPage = (p) => setPage(Math.max(1, Math.min(totalPages, p)));

  const flash = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(''), 4000);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (project) => {
    setForm(toForm(project));
    setEditingId(project.id);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const isEdit = editingId !== null;
    const url = isEdit ? `/api/projects/${editingId}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) return router.replace('/admin/login');
        setError(data.msg || 'Save failed');
        setSaving(false);
        return;
      }
      if (isEdit) {
        setProjects((list) =>
          list.map((p) => (p.id === editingId ? data : p))
        );
        flash(setSuccess, 'Project updated.');
      } else {
        setProjects((list) => [...list, data]);
        // Reveal the newly added project on the last page.
        setPage(Math.ceil((projects.length + 1) / pageSize));
        flash(setSuccess, 'Project created.');
      }
      resetForm();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        if (res.status === 401) return router.replace('/admin/login');
        const data = await res.json();
        setError(data.msg || 'Delete failed');
        return;
      }
      setProjects((list) => list.filter((p) => p.id !== project.id));
      if (editingId === project.id) resetForm();
      flash(setSuccess, 'Project deleted.');
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Projects Admin</h1>
          <div className={styles.headerActions}>
            <span className={styles.userTag}>
              Signed in as {user.username}
            </span>
            <a className={`${styles.btn} ${styles.btnSmall}`} href="/projects">
              View site
            </a>
            <button
              className={`${styles.btn} ${styles.btnSmall}`}
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        {error && (
          <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>
        )}
        {success && (
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            {success}
          </div>
        )}

        <section className={styles.panel}>
          <h2>{editingId !== null ? 'Edit project' : 'Add new project'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  className={styles.input}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="demo">Demo URL</label>
                <input
                  id="demo"
                  name="demo"
                  className={styles.input}
                  value={form.demo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="image">Image URL</label>
                <input
                  id="image"
                  name="image"
                  className={styles.input}
                  value={form.image}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className={styles.textarea}
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  id="tags"
                  name="tags"
                  className={styles.input}
                  placeholder="next, tailwind, firebase"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="source_code">Source code URL (optional)</label>
                <input
                  id="source_code"
                  name="source_code"
                  className={styles.input}
                  value={form.source_code}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button
                className={styles.btnPrimary}
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Saving…'
                  : editingId !== null
                  ? 'Update project'
                  : 'Create project'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  className={styles.btn}
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <div className={styles.listHead}>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>
            All projects ({projects.length})
          </h2>
          <label className={styles.pageSize}>
            Per page
            <select
              className={styles.select}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>

        {projects.length === 0 ? (
          <div className={styles.empty}>No projects yet. Add one above.</div>
        ) : (
          <div className={styles.list}>
            {pageItems.map((project) => (
              <div className={styles.row} key={project.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.thumb}
                  src={project.image}
                  alt={project.name}
                />
                <div className={styles.rowBody}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  {Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className={styles.tags}>
                      {project.tags.map((tag) => (
                        <span className={styles.tag} key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.rowActions}>
                  <button
                    className={`${styles.btn} ${styles.btnSmall}`}
                    onClick={() => startEdit(project)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Projects pagination">
            <button
              className={`${styles.btn} ${styles.btnSmall}`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.btn} ${styles.btnSmall} ${
                  p === currentPage ? styles.pageActive : ''
                }`}
                onClick={() => goToPage(p)}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </button>
            ))}
            <button
              className={`${styles.btn} ${styles.btnSmall}`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next →
            </button>
          </nav>
        )}

        {projects.length > 0 && (
          <p className={styles.pageInfo}>
            Showing {pageStart + 1}–{Math.min(pageStart + pageSize, projects.length)} of{' '}
            {projects.length}
          </p>
        )}
      </div>
    </div>
  );
};

// Server-side guard: only an authenticated admin can reach the dashboard.
export async function getServerSideProps({ req }) {
  const session = getSessionFromReq(req);
  if (!session) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return {
    props: {
      title: 'Dashboard',
      initialProjects: getProjects(),
      user: { username: session.sub },
    },
  };
}

export default AdminDashboard;

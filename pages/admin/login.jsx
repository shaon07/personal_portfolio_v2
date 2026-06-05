import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSessionFromReq } from '../../lib/auth';
import styles from '../../styles/Admin.module.css';

const AdminLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || 'Login failed');
        setLoading(false);
        return;
      }
      router.replace('/admin');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrap}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p>Sign in to manage your projects.</p>

        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

        <div className={styles.field}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className={styles.input}
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={styles.btnPrimary} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

// If already authenticated, skip the login page.
export async function getServerSideProps({ req }) {
  if (getSessionFromReq(req)) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: { title: 'Login' } };
}

export default AdminLogin;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold bg-brand-gradient bg-clip-text text-transparent">
          Welcome back
        </h1>
        <input className="input" placeholder="Email" type="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-rose-400 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-sm text-zinc-400 text-center">
          No account? <Link to="/signup" className="text-indigo-400">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

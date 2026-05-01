import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold bg-brand-gradient bg-clip-text text-transparent">
          Create your account
        </h1>
        <input className="input" placeholder="Full name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div className="flex gap-2">
          {['member', 'admin'].map((r) => (
            <button type="button" key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm capitalize ${
                form.role === r
                  ? 'bg-brand-gradient border-transparent text-white'
                  : 'border-white/10 bg-white/5 text-zinc-300'
              }`}>
              {r}
            </button>
          ))}
        </div>
        {error && <p className="text-rose-400 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Sign up'}
        </button>
        <p className="text-sm text-zinc-400 text-center">
          Have an account? <Link to="/login" className="text-indigo-400">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

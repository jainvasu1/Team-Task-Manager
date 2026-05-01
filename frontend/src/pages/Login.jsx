import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#0A0612] relative overflow-hidden flex">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-fuchsia-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-700/15 blur-[120px]" />

      {/* LEFT — Brand panel */}
      <div className="hidden lg:flex flex-1 relative p-12 flex-col justify-between">
        {/* Floating card mockups behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[420px] h-[260px] opacity-40">
            <div className="absolute top-0 left-0 w-72 h-44 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md rotate-[-8deg]" />
            <div className="absolute top-10 left-24 w-72 h-44 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md rotate-[6deg]" />
          </div>
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-fuchsia-500/30">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="text-white font-semibold text-lg">TaskFlow</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-white text-4xl font-semibold tracking-tight">
            Master your velocity.
          </h1>
          <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
            The elite task management ecosystem for high-performance teams who demand precision and beauty in every pixel.
          </p>
        </div>

        {/* Trusted by */}
        <div className="relative z-10">
          <p className="text-zinc-500 text-xs tracking-[0.25em] font-medium">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="mt-4 flex items-center gap-8 text-zinc-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" /><rect x="3" y="13" width="8" height="8" /></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><line x1="7" y1="7" x2="10" y2="10" /><line x1="17" y1="7" x2="14" y2="10" /><line x1="7" y1="17" x2="10" y2="14" /><line x1="17" y1="17" x2="14" y2="14" /></svg>
          </div>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div className="w-full lg:w-[520px] flex items-center justify-center p-6 lg:p-12 relative z-10">
        <form
          onSubmit={onSubmit}
          autoComplete="off"
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-[0_8px_60px_-15px_rgba(139,92,246,0.25)]"
        >
          <h2 className="text-white text-2xl font-semibold">Welcome Back</h2>
          <p className="mt-1 text-zinc-400 text-sm">
            Sign in to your high-velocity workspace.
          </p>

          {/* Email */}
          <div className="mt-6">
            <label className="text-zinc-300 text-xs font-medium">Email Address</label>
            <div className="mt-2 relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="taskflow-email"
                autoComplete="off"
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="text-zinc-300 text-xs font-medium">Password</label>
              <button type="button" className="text-[11px] font-semibold tracking-wider text-fuchsia-500 hover:text-fuchsia-400">
                FORGOT?
              </button>
            </div>
            <div className="mt-2 relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="taskflow-password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
          </div>

          {error && <p className="mt-3 text-rose-400 text-xs">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In to TaskFlow'}
          </button>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] tracking-[0.25em] font-semibold text-fuchsia-500">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="mt-4 w-full py-2.5 rounded-lg border border-white/10 bg-black/30 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          {/* Footer link */}
          <p className="mt-6 text-center text-xs text-zinc-500">
            Don't have a workspace?{' '}
            <Link to="/signup" className="text-fuchsia-500 hover:text-fuchsia-400 font-medium">
              Create one now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '', newPassword: '' });
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const submitReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMsg('');
    setResetLoading(true);
    try {
      await api.post('/auth/reset-password', resetForm);
      setResetMsg('Password reset successful. You can now sign in.');
      setResetForm({ email: '', newPassword: '' });
    } catch (err) {
      setResetError(err.response?.data?.message || 'Reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password, remember);
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

      {/* Forgot password modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={submitReset} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#13101a] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Reset Password</h3>
              <button type="button" onClick={() => { setForgotOpen(false); setResetMsg(''); setResetError(''); }}
                className="text-zinc-400 hover:text-white transition">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 text-xs font-medium">Email</label>
                <input required type="email" value={resetForm.email}
                  onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                  placeholder="name@company.com"
                  className="mt-1.5 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 transition" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium">New Password</label>
                <input required type="password" value={resetForm.newPassword}
                  onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1.5 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 transition" />
              </div>
            </div>
            {resetError && <p className="mt-2 text-rose-400 text-xs">{resetError}</p>}
            {resetMsg && <p className="mt-2 text-emerald-400 text-xs">{resetMsg}</p>}
            <button disabled={resetLoading}
              className="mt-4 w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 transition disabled:opacity-60">
              {resetLoading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </div>
      )}

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
              <button type="button" onClick={() => setForgotOpen(true)} className="text-[11px] font-semibold tracking-wider text-fuchsia-500 hover:text-fuchsia-400">
                FORGOT?
              </button>
            </div>
            <div className="mt-2 relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="taskflow-password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="mt-4 flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border border-white/20 bg-black/30 accent-fuchsia-500 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-zinc-400 cursor-pointer select-none">
              Remember me
            </label>
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

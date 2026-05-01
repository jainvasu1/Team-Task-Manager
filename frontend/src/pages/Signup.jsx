import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function calcStrength(pw) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..5
}

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => calcStrength(form.password), [form.password]);
  const strengthLabel =
    strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Secure';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agree) return setError('Please accept the Terms and Privacy Policy.');
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
    <div className="min-h-screen w-full bg-[#0A0612] relative overflow-hidden flex">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-fuchsia-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-700/15 blur-[120px]" />

      {/* LEFT — Brand panel */}
      <div className="hidden lg:flex flex-1 relative p-12 flex-col justify-center">
        <div className="relative z-10 max-w-md space-y-8">
          <span className="text-fuchsia-400 font-semibold tracking-wide bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            TaskFlow
          </span>

          <div>
            <h1 className="text-white text-4xl font-semibold tracking-tight leading-tight">
              High velocity<br />teamwork, crystal<br />clarity.
            </h1>
            <p className="mt-5 text-zinc-400 text-sm leading-relaxed max-w-sm">
              Join over 10,000 teams accelerating their output with our premium task management suite.
            </p>
          </div>

          {/* Avatars + trust block */}
          <div className="inline-flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md px-4 py-3">
            <div className="flex -space-x-2">
              {['#8B5CF6', '#EC4899', '#6366F1'].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#0A0612]"
                  style={{ background: `linear-gradient(135deg, ${c}, #4338ca)` }}
                />
              ))}
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] text-zinc-500 font-medium">TRUSTED BY TEAMS AT</p>
              <p className="text-sm text-white font-semibold">Leading Tech Orgs</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Signup form */}
      <div className="w-full lg:w-[520px] flex items-center justify-center p-6 lg:p-12 relative z-10">
        <form
          onSubmit={onSubmit}
          autoComplete="off"
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-[0_8px_60px_-15px_rgba(139,92,246,0.25)]"
        >
          <h2 className="text-white text-2xl font-semibold">Create Account</h2>
          <p className="mt-1 text-zinc-400 text-sm">Start your 14-day premium trial today.</p>

          {/* Full name */}
          <div className="mt-6">
            <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">FULL NAME</label>
            <div className="mt-2 relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="tf-name"
                autoComplete="off"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">WORK EMAIL</label>
            <div className="mt-2 relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="tf-email"
                autoComplete="off"
                placeholder="john@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">PASSWORD</label>
            <div className="mt-2 relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="tf-password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>

            {/* Strength bar */}
            <div className="mt-3 flex items-center justify-between text-[10px]">
              <span className="text-zinc-500">Password Strength</span>
              <span className="text-fuchsia-400 font-medium">{strengthLabel}</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all"
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Role toggle */}
          <div className="mt-5">
            <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">PRIMARY ROLE</label>
            <div className="mt-2 grid grid-cols-2 p-1 rounded-lg bg-black/30 border border-white/10">
              {['member', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 rounded-md text-sm font-medium capitalize transition ${
                    form.role === r
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <label className="mt-5 flex items-start gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 accent-fuchsia-500"
            />
            <span>
              I agree to the{' '}
              <a className="text-fuchsia-400 hover:underline">Terms of Service</a> and{' '}
              <a className="text-fuchsia-400 hover:underline">Privacy Policy</a>.
            </span>
          </label>

          {error && <p className="mt-3 text-rose-400 text-xs">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating…' : (
              <>
                Get Started for Free <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="mt-5 text-center text-xs text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-fuchsia-500 hover:text-fuchsia-400 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

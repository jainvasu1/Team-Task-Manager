import { useEffect, useMemo, useState } from 'react';
import { Share2, BarChart3, Rocket, ShieldCheck, CreditCard, FolderKanban, Plus, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';
import ProjectGridCard from '../components/ProjectGridCard';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const FILTERS = ['All', 'Active', 'Archived', 'My Projects'];

const SAMPLE = [
  {
    _id: 's1',
    name: 'Quantum Rebrand',
    description: 'Complete visual overhaul of the flagship platform including design systems and asset libraries.',
    accent: 'violet',
    icon: Share2,
    progress: 72,
    taskCount: 24,
    members: [{}, {}, {}],
  },
  {
    _id: 's2',
    name: 'AI Engine Integration',
    description: 'Deploying the new LLM infrastructure across all customer touchpoints and internal tools.',
    accent: 'amber',
    icon: BarChart3,
    progress: 35,
    taskCount: 12,
    members: [{}, {}],
  },
  {
    _id: 's3',
    name: 'Mobile V2.0',
    description: 'Redesigning the mobile experience with React Native and custom gesture-driven navigation.',
    accent: 'fuchsia',
    icon: Rocket,
    progress: 92,
    taskCount: 48,
    members: [{}, {}],
  },
  {
    _id: 's4',
    name: 'Security Audit 2024',
    description: "Comprehensive review of the platform's security protocols, including penetration testing and vulnerability assessments for the enterprise tier.",
    accent: 'violet',
    icon: ShieldCheck,
    badge: 'INTERNAL',
    progress: 0,
    taskCount: 0,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=70',
    members: [{}],
  },
  {
    _id: 's5',
    name: 'Billing Infrastructure',
    description: 'Migration to Stripe Billing for global subscription management and multi-currency support.',
    accent: 'emerald',
    icon: CreditCard,
    progress: 15,
    taskCount: 32,
    members: [{}],
  },
];

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const list = useMemo(() => {
    const real = projects.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description || 'No description provided.',
      progress: 0,
      taskCount: 0,
      icon: FolderKanban,
      accent: ['violet', 'fuchsia', 'amber', 'emerald'][(p.name?.length || 0) % 4],
      members: p.members || [],
    }));
    const merged = real.length ? real : SAMPLE;
    if (filter === 'My Projects' && user)
      return merged.filter((p) => p.members?.some?.((m) => m._id === user.id));
    if (filter === 'Archived') return merged.filter((p) => p.status === 'archived');
    if (filter === 'Active') return merged.filter((p) => p.status !== 'archived');
    return merged;
  }, [projects, filter, user]);

  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100">
      <Topnav
        action={
          user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/30 hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          )
        }
      />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 space-y-8">
          <header className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold">Projects</h1>
              <p className="text-zinc-400 text-sm mt-1">
                Manage and track your team's active initiatives.
              </p>
            </div>
            <div className="flex p-1 rounded-lg border border-white/10 bg-white/[0.03]">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    filter === f
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </header>

          <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {list.map((p) => (
              <ProjectGridCard
                key={p._id}
                to={`/projects/${p._id}`}
                icon={p.icon}
                title={p.name}
                description={p.description}
                progress={p.progress}
                taskCount={p.taskCount}
                accent={p.accent}
                members={p.members}
                image={p.image}
                badge={p.badge}
              />
            ))}
          </section>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={create}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#13101a] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-semibold">New Project</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">NAME</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
                  placeholder="Project name"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
                  placeholder="What is this project about?"
                />
              </div>
            </div>
            <button
              disabled={saving}
              className="mt-6 w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/30 hover:opacity-95 transition disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create Project'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { FolderKanban, Plus, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';
import ProjectGridCard from '../components/ProjectGridCard';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const FILTERS = ['All', 'Active', 'Archived', 'My Projects'];
const ACCENTS = ['violet', 'fuchsia', 'amber', 'emerald'];

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

  const deleteProject = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  const list = useMemo(() => {
    if (filter === 'My Projects' && user)
      return projects.filter((p) => p.members?.some((m) => (m._id || m) === user.id));
    if (filter === 'Archived') return projects.filter((p) => p.status === 'archived');
    if (filter === 'Active') return projects.filter((p) => p.status !== 'archived');
    return projects;
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
              <Plus className="w-4 h-4" /> New Project
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
              <p className="text-zinc-400 text-sm mt-1">Manage and track your team's active initiatives.</p>
            </div>
            <div className="flex p-1 rounded-lg border border-white/10 bg-white/[0.03]">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    filter === f ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </header>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <FolderKanban className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No projects found.</p>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 text-xs text-fuchsia-400 hover:text-fuchsia-300"
                >
                  + Create your first project
                </button>
              )}
            </div>
          ) : (
            <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {list.map((p, i) => (
                <div key={p._id} className="relative group">
                  <ProjectGridCard
                    to={`/projects/${p._id}`}
                    icon={FolderKanban}
                    title={p.name}
                    description={p.description || 'No description provided.'}
                    progress={0}
                    taskCount={0}
                    accent={ACCENTS[i % ACCENTS.length]}
                    members={p.members || []}
                  />
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => deleteProject(p._id)}
                      className="absolute top-3 right-3 w-7 h-7 grid place-items-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 opacity-0 group-hover:opacity-100 transition z-10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </section>
          )}
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

import { useEffect, useState } from 'react';
import { LayoutGrid, Zap, CheckCircle2, AlertTriangle, Plus, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import TaskBoard from '../components/TaskBoard';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const ACCENT = ['violet', 'fuchsia', 'amber', 'emerald'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/tasks/stats').then((r) => setStats(r.data)).catch(() => {});
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100 flex relative">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <Topbar />
        <header>
          <h1 className="text-3xl font-semibold">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            You have {(stats.todo || 0) + (stats.inProgress || 0)} tasks to complete today.
          </p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={LayoutGrid}    label="TOTAL TASKS"  value={String(stats.total      || 0).padStart(2,'0')} trend="+12%" trendType="up"   accent="violet"  />
          <StatCard icon={Zap}           label="IN PROGRESS"  value={String(stats.inProgress || 0).padStart(2,'0')} trend="Stable" trendType="flat" accent="fuchsia" />
          <StatCard icon={CheckCircle2}  label="COMPLETED"    value={String(stats.done       || 0).padStart(2,'0')} trend="+8%"  trendType="up"   accent="emerald" />
          <StatCard icon={AlertTriangle} label="OVERDUE"      value={String(stats.overdue    || 0).padStart(2,'0')} trend="-5%"  trendType="down" accent="rose"    />
        </section>

        {/* Recent Projects — real data */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link to="/projects" className="text-xs text-fuchsia-400 hover:text-fuchsia-300">View All →</Link>
          </div>
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-zinc-500 text-sm">No projects yet.</p>
              {user?.role === 'admin' && (
                <Link to="/projects" className="mt-3 inline-block text-xs text-fuchsia-400 hover:text-fuchsia-300">
                  + Create your first project
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {projects.slice(0, 3).map((p, i) => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-lg grid place-items-center bg-gradient-to-br ${
                      ['from-violet-500/30 to-violet-500/0 text-violet-300',
                       'from-fuchsia-500/30 to-fuchsia-500/0 text-fuchsia-300',
                       'from-amber-500/30 to-amber-500/0 text-amber-300'][i % 3]
                    }`}>
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div className="flex -space-x-2">
                      {(p.members || []).slice(0, 3).map((_, mi) => (
                        <div key={mi} className="w-6 h-6 rounded-full border-2 border-[#0A0612] bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                      ))}
                    </div>
                  </div>
                  <h3 className="mt-4 text-white font-semibold">{p.name}</h3>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{p.description || 'No description'}</p>
                  <div className="mt-4 h-1 rounded-full bg-white/5">
                    <div className="h-full w-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">{p.members?.length || 0} members</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <TaskBoard />
      </main>

      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white grid place-items-center shadow-lg shadow-fuchsia-600/40 hover:scale-105 transition z-30">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

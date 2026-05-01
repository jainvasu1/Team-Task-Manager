import { useEffect, useMemo, useState } from 'react';
import { Share2, BarChart3, Rocket, ShieldCheck, CreditCard, FolderKanban } from 'lucide-react';
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

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

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
      <Topnav />
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
    </div>
  );
}

import { useEffect, useState } from 'react';
import { LayoutGrid, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import TaskBoard from '../components/TaskBoard';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });

  useEffect(() => {
    api.get('/tasks/stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <Topbar />
        <header>
          <h1 className="text-3xl font-semibold">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">You have {stats.todo + stats.inProgress} tasks to complete today.</p>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={LayoutGrid} label="TOTAL TASKS" value={String(stats.total).padStart(3, '0')} trend="+12%" trendType="up" accent="violet" />
          <StatCard icon={Zap} label="IN PROGRESS" value={String(stats.inProgress).padStart(2, '0')} trend="Stable" trendType="flat" accent="fuchsia" />
          <StatCard icon={CheckCircle2} label="COMPLETED" value={String(stats.done).padStart(2, '0')} trend="+8%" trendType="up" accent="emerald" />
          <StatCard icon={AlertTriangle} label="OVERDUE" value={String(stats.overdue).padStart(2, '0')} trend="-5%" trendType="down" accent="rose" />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <Link to="/projects" className="text-xs text-fuchsia-400 hover:text-fuchsia-300">View All →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <ProjectCard tag="ACTIVE" title="Neo-Banking UI Design" subtitle="Fintech Mobile Application overhaul" progress={70} daysLeft={12} />
            <ProjectCard tag="PLANNING" title="TaskFlow 2.0 Docs" subtitle="Internal documentation and wiki" progress={20} daysLeft={28} />
            <ProjectCard tag="URGENT" title="Q4 Marketing Assets" subtitle="Social media and ad campaign" progress={55} daysLeft={3} />
          </div>
        </section>

        <TaskBoard />
      </main>
    </div>
  );
}

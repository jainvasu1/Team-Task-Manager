import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/tasks/stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total', value: stats?.total ?? '—' },
    { label: 'To Do', value: stats?.todo ?? '—' },
    { label: 'In Progress', value: stats?.inProgress ?? '—' },
    { label: 'Done', value: stats?.done ?? '—' },
    { label: 'Overdue', value: stats?.overdue ?? '—' },
  ];

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Hi, {user?.name}</h1>
          <p className="text-zinc-400 text-sm capitalize">{user?.role}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/projects" className="btn-ghost">Projects</Link>
          <Link to="/tasks" className="btn-ghost">Tasks</Link>
          <button onClick={logout} className="btn-ghost">Logout</button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-zinc-400 text-sm">{c.label}</p>
            <p className="text-3xl font-semibold mt-2">{c.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';
import api from '../lib/api';

const FILTERS = ['All', 'Active', 'Archived', 'My Projects'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

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
        </main>
      </div>
    </div>
  );
}

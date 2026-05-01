import { useState } from 'react';
import { Menu, Search, ChevronDown, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaskRow from '../components/TaskRow';

const SAMPLE_TASKS = [
  { id: 't1', title: 'Design System Audit for Q3 Sprint', priority: 'URGENT', status: 'IN PROGRESS', assignee: 'Alex Miller', due: 'Oct 24' },
  { id: 't2', title: 'API Documentation Review', priority: 'MEDIUM', status: 'BACKLOG', assignee: 'Sarah K.', due: 'Oct 28' },
  { id: 't3', title: 'Weekly Sync Preparation', priority: 'LOW', status: 'PLANNING', assignee: 'James D.', due: 'Oct 30' },
];

const VIEWS = ['Board', 'List', 'Calendar'];

export default function Tasks() {
  const { user } = useAuth();
  const [view, setView] = useState('List');
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () =>
    setSelected(selected.size === SAMPLE_TASKS.length ? new Set() : new Set(SAMPLE_TASKS.map((t) => t.id)));
  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100 pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#0a0612]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 grid place-items-center rounded-lg text-zinc-300 hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-fuchsia-400 font-semibold">Tasks</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 grid place-items-center rounded-lg text-zinc-300 hover:bg-white/5">
              <Search className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center text-[11px] font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 mt-6 flex justify-center">
        <div className="inline-flex p-1 rounded-full border border-white/10 bg-white/[0.03]">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-1.5 text-xs font-medium rounded-full transition ${
                view === v
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5 flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] transition">
          <Filter className="w-3 h-3" /> Project
        </button>
        {['Priority', 'Status', 'Assignee'].map((f) => (
          <button
            key={f}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] transition"
          >
            {f} <ChevronDown className="w-3 h-3" />
          </button>
        ))}
      </div>

      <div className="px-4 mt-5 flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.size === SAMPLE_TASKS.length}
            onChange={toggleAll}
            className="accent-fuchsia-500"
          />
          Select All
        </label>
        <span className="text-fuchsia-400 font-medium">{SAMPLE_TASKS.length} Tasks</span>
      </div>

      <div className="px-4 mt-3 space-y-3">
        {SAMPLE_TASKS.map((t) => (
          <TaskRow key={t.id} task={t} selected={selected.has(t.id)} onToggle={() => toggle(t.id)} />
        ))}
      </div>
    </div>
  );
}

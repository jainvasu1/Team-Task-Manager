import { useState } from 'react';
import { Menu, Search, ChevronDown, Filter, Clock, UserPlus, Trash2, LayoutGrid, CheckSquare, FolderKanban, Calendar as CalIcon, Settings, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskRow from '../components/TaskRow';

const NAV = [
  { to: '/dashboard', label: 'Dash', icon: LayoutGrid },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/settings', label: 'Set', icon: Settings },
];

function MiniCalendar() {
  const today = new Date();
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const prev = () => setCur(({ year, month }) =>
    month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
  );
  const next = () => setCur(({ year, month }) =>
    month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
  );

  const monthName = new Date(cur.year, cur.month).toLocaleString('default', { month: 'long' });
  const firstDay = new Date(cur.year, cur.month, 1).getDay();
  const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  const isToday = (d) =>
    d === today.getDate() &&
    cur.month === today.getMonth() &&
    cur.year === today.getFullYear();

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 w-72 rounded-2xl border border-white/10 bg-[#13101a]/95 backdrop-blur-xl shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 grid place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition text-lg leading-none">‹</button>
        <p className="text-sm font-semibold text-white">{monthName} {cur.year}</p>
        <button onClick={next} className="w-7 h-7 grid place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition text-lg leading-none">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <span key={i} className="text-[10px] text-zinc-500 font-medium">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {cells.map((d, i) => (
          <button
            key={i}
            disabled={!d}
            className={`w-8 h-8 mx-auto rounded-full text-xs transition ${
              isToday(d)
                ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-semibold shadow-md shadow-fuchsia-600/30'
                : d
                ? 'text-zinc-300 hover:bg-white/10'
                : 'pointer-events-none'
            }`}
          >
            {d || ''}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  const [showCal, setShowCal] = useState(false);

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

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-[#0a0612]/95 backdrop-blur-xl">
        {showCal && <MiniCalendar />}
        <div className="grid grid-cols-5 px-2 py-2">
          {NAV.slice(0, 3).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] tracking-wider font-semibold transition ${
                  isActive ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label.toUpperCase()}
            </NavLink>
          ))}
          {/* Cal toggle */}
          <button
            onClick={() => setShowCal(!showCal)}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] tracking-wider font-semibold transition ${
              showCal ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <CalIcon className="w-4 h-4" />
            CAL
          </button>
          {/* Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] tracking-wider font-semibold transition ${
                isActive ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            SET
          </NavLink>
        </div>
      </nav>

      {/* Floating add */}
      <button className="fixed bottom-20 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white grid place-items-center shadow-lg shadow-fuchsia-500/40 hover:scale-105 transition">
        <Plus className="w-5 h-5" />
      </button>

      {selected.size > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-[#1a1320]/95 backdrop-blur-xl shadow-2xl">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center text-xs font-semibold">
              {selected.size}
            </div>
            <span className="text-sm text-white">{selected.size === 1 ? 'Item' : 'Items'} Selected</span>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button className="w-8 h-8 grid place-items-center rounded-lg text-zinc-300 hover:bg-white/10 transition">
              <Clock className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 grid place-items-center rounded-lg text-zinc-300 hover:bg-white/10 transition">
              <UserPlus className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 grid place-items-center rounded-lg text-rose-400 hover:bg-rose-500/10 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

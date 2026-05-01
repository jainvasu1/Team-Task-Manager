import { useState, useEffect } from 'react';
import { Menu, Search, ChevronDown, Filter, Clock, UserPlus, Trash2, Plus, X, Calendar as CalIcon, LayoutGrid, CheckSquare, FolderKanban, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskRow from '../components/TaskRow';
import api from '../lib/api';

const VIEWS = ['Board', 'List', 'Calendar'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['todo', 'in-progress', 'done'];
const NAV = [
  { to: '/dashboard', label: 'Dash', icon: LayoutGrid },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/settings', label: 'Set', icon: Settings },
];

function MiniCalendar() {
  const today = new Date();
  const [cur, setCur] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const prev = () => setCur(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
  const next = () => setCur(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });
  const monthName = new Date(cur.year, cur.month).toLocaleString('default', { month: 'long' });
  const firstDay = new Date(cur.year, cur.month, 1).getDay();
  const daysInMonth = new Date(cur.year, cur.month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const isToday = (d) => d === today.getDate() && cur.month === today.getMonth() && cur.year === today.getFullYear();
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 w-72 rounded-2xl border border-white/10 bg-[#13101a]/95 backdrop-blur-xl shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 grid place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition text-lg">‹</button>
        <p className="text-sm font-semibold text-white">{monthName} {cur.year}</p>
        <button onClick={next} className="w-7 h-7 grid place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition text-lg">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[10px] text-zinc-500 font-medium">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {cells.map((d, i) => (
          <button key={i} disabled={!d} className={`w-8 h-8 mx-auto rounded-full text-xs transition ${isToday(d) ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white font-semibold shadow-md shadow-fuchsia-600/30' : d ? 'text-zinc-300 hover:bg-white/10' : 'pointer-events-none'}`}>
            {d || ''}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Tasks() {
  const { user } = useAuth();
  const [view, setView] = useState('List');
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [showCal, setShowCal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: '', project: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/tasks').then((r) => setTasks(r.data)).catch(() => {});
  useEffect(() => {
    load();
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const toggle = (id) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };
  const toggleAll = () => setSelected(selected.size === tasks.length ? new Set() : new Set(tasks.map((t) => t._id)));

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: '', project: '', assignedTo: '', priority: 'medium', dueDate: '', status: 'todo' });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditTask(t);
    setForm({
      title: t.title,
      project: t.project?._id || t.project || '',
      assignedTo: t.assignedTo?._id || t.assignedTo || '',
      priority: t.priority || 'medium',
      dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
      status: t.status || 'todo',
    });
    setShowModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editTask) {
        await api.patch(`/tasks/${editTask._id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selected.size} task(s)?`)) return;
    await Promise.all([...selected].map((id) => api.delete(`/tasks/${id}`)));
    setSelected(new Set());
    load();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}`, { status });
    load();
  };

  const rowTasks = tasks.map((t) => ({
    id: t._id,
    title: t.title,
    priority: (t.priority || 'medium').toUpperCase(),
    status: t.status === 'in-progress' ? 'IN PROGRESS' : t.status === 'done' ? 'DONE' : 'BACKLOG',
    assignee: t.assignedTo?.name || 'Unassigned',
    due: t.dueDate ? new Date(t.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '—',
    _raw: t,
  }));

  const selectedProject = projects.find((p) => p._id === form.project);

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

      {/* View toggle */}
      <div className="px-4 mt-6 flex justify-center">
        <div className="inline-flex p-1 rounded-full border border-white/10 bg-white/[0.03]">
          {VIEWS.map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-5 py-1.5 text-xs font-medium rounded-full transition ${view === v ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30' : 'text-zinc-400 hover:text-white'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-4 mt-5 flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] transition">
          <Filter className="w-3 h-3" /> Project
        </button>
        {['Priority', 'Status', 'Assignee'].map((f) => (
          <button key={f} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] transition">
            {f} <ChevronDown className="w-3 h-3" />
          </button>
        ))}
      </div>

      {/* Select all + count */}
      <div className="px-4 mt-5 flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
          <input type="checkbox" checked={selected.size === tasks.length && tasks.length > 0} onChange={toggleAll} className="accent-fuchsia-500" />
          Select All
        </label>
        <span className="text-fuchsia-400 font-medium">{tasks.length} Tasks</span>
      </div>

      {/* Task list */}
      <div className="px-4 mt-3 space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <CheckSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No tasks yet.</p>
            {user?.role === 'admin' && (
              <button onClick={openCreate} className="mt-3 text-xs text-fuchsia-400 hover:text-fuchsia-300">
                + Create your first task
              </button>
            )}
          </div>
        ) : (
          rowTasks.map((t) => (
            <div key={t.id} onDoubleClick={() => openEdit(t._raw)}>
              <TaskRow task={t} selected={selected.has(t.id)} onToggle={() => toggle(t.id)} />
            </div>
          ))
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-[#0a0612]/95 backdrop-blur-xl">
        {showCal && <MiniCalendar />}
        <div className="grid grid-cols-5 px-2 py-2">
          {NAV.slice(0, 3).map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] tracking-wider font-semibold transition ${isActive ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Icon className="w-4 h-4" />{label.toUpperCase()}
            </NavLink>
          ))}
          <button onClick={() => setShowCal(!showCal)}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] tracking-wider font-semibold transition ${showCal ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <CalIcon className="w-4 h-4" />CAL
          </button>
          <NavLink to="/settings"
            className={({ isActive }) => `flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] tracking-wider font-semibold transition ${isActive ? 'text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Settings className="w-4 h-4" />SET
          </NavLink>
        </div>
      </nav>

      {/* FAB */}
      {user?.role === 'admin' && (
        <button onClick={openCreate}
          className="fixed bottom-20 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white grid place-items-center shadow-lg shadow-fuchsia-500/40 hover:scale-105 transition">
          <Plus className="w-5 h-5" />
        </button>
      )}

      {/* Selection action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-[#1a1320]/95 backdrop-blur-xl shadow-2xl">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center text-xs font-semibold">{selected.size}</div>
            <span className="text-sm text-white">{selected.size === 1 ? 'Item' : 'Items'} Selected</span>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button className="w-8 h-8 grid place-items-center rounded-lg text-zinc-300 hover:bg-white/10 transition"><Clock className="w-4 h-4" /></button>
            <button className="w-8 h-8 grid place-items-center rounded-lg text-zinc-300 hover:bg-white/10 transition"><UserPlus className="w-4 h-4" /></button>
            <button onClick={deleteSelected} className="w-8 h-8 grid place-items-center rounded-lg text-rose-400 hover:bg-rose-500/10 transition"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={save} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#13101a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-semibold">{editTask ? 'Edit Task' : 'New Task'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">TITLE</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition"
                placeholder="Task title" />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">PROJECT</label>
              <select required value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}
                className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition">
                <option value="">Select project</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            {selectedProject && (
              <div>
                <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">ASSIGNEE</label>
                <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition">
                  <option value="">Unassigned</option>
                  {(selectedProject.members || []).map((m) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">PRIORITY</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition capitalize">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">STATUS</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400">DUE DATE</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/60 transition" />
            </div>

            <button disabled={saving}
              className="w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/30 hover:opacity-95 transition disabled:opacity-60">
              {saving ? 'Saving…' : editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

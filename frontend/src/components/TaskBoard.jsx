import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../lib/api';

const STATUSES = ['todo', 'in-progress', 'done'];
const COL = {
  'todo':        { label: 'TO DO',       dot: 'bg-violet-400' },
  'in-progress': { label: 'IN PROGRESS', dot: 'bg-fuchsia-400' },
  'done':        { label: 'DONE',        dot: 'bg-emerald-400' },
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);

  const load = () =>
    api.get('/tasks?mine=true').then((r) => setTasks(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}`, { status });
    load();
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">My Tasks Today</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {STATUSES.map((s) => {
          const col = COL[s];
          const colTasks = tasks.filter((t) => t.status === s);
          return (
            <div key={s} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-300">{col.label}</span>
                </div>
                <span className="text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">{colTasks.length}</span>
              </div>
              <div className="mt-2 space-y-2">
                {colTasks.map((t) => (
                  <div key={t._id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-xs text-fuchsia-400 font-bold tracking-wider">{t.priority?.toUpperCase()}</p>
                    <p className="mt-1 text-sm text-white font-medium">{t.title}</p>
                    {t.dueDate && (
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Due {new Date(t.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <select
                      value={t.status}
                      onChange={(e) => updateStatus(t._id, e.target.value)}
                      className="mt-2 w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                    >
                      {STATUSES.map((x) => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <p className="text-xs text-zinc-600 px-2 py-3">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

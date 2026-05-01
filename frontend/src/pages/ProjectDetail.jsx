import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['todo', 'in-progress', 'done'];

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', assignedTo: '', dueDate: '', priority: 'medium' });

  const load = async () => {
    const [p, t] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/tasks?project=${id}`),
    ]);
    setProject(p.data);
    setTasks(t.data);
  };

  useEffect(() => { load(); }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    await api.post('/tasks', { ...form, project: id });
    setForm({ title: '', assignedTo: '', dueDate: '', priority: 'medium' });
    load();
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}`, { status });
    load();
  };

  if (!project) return <div className="p-6 text-zinc-400">Loading…</div>;

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-zinc-400 text-sm">{project.description}</p>
      </header>

      {user?.role === 'admin' && (
        <form onSubmit={createTask} className="card grid md:grid-cols-5 gap-2">
          <input className="input md:col-span-2" placeholder="Task title"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="input" value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
            <option value="">Unassigned</option>
            {project.members?.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <input className="input" type="date" value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <button className="btn-primary">Add Task</button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {STATUSES.map((s) => (
          <div key={s} className="card">
            <h3 className="font-semibold capitalize mb-3">{s.replace('-', ' ')}</h3>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === s).map((t) => (
                <div key={t._id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="font-medium text-sm">{t.title}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {t.assignedTo?.name || 'Unassigned'}
                    {t.dueDate && ` · ${new Date(t.dueDate).toLocaleDateString()}`}
                  </p>
                  <select value={t.status}
                    onChange={(e) => updateStatus(t._id, e.target.value)}
                    className="input mt-2 text-xs">
                    {STATUSES.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

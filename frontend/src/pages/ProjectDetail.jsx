import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, FolderKanban, UserPlus, X, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';
import api from '../lib/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const [tasks, setTasks] = useState([]);
  const loadTasks = () => api.get(`/tasks?project=${id}`).then((r) => setTasks(r.data)).catch(() => {});
  const load = () => api.get(`/projects/${id}`).then((r) => setProject(r.data)).catch(() => {});

  useEffect(() => {
    load();
    loadTasks();
    api.get('/users').then((r) => setAllUsers(r.data)).catch(() => {});
  }, [id]);

  const addMember = async () => {
    if (!selectedUser) return;
    await api.post(`/projects/${id}/members`, { userId: selectedUser });
    setSelectedUser('');
    setAddingMember(false);
    load();
  };

  const removeMember = async (userId) => {
    await api.delete(`/projects/${id}/members/${userId}`);
    load();
  };

  const updateTaskStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}`, { status });
    loadTasks();
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    loadTasks();
  };

  const COLS = [
    { key: 'todo',        label: 'TO DO',       dot: 'bg-violet-400' },
    { key: 'in-progress', label: 'IN PROGRESS',  dot: 'bg-fuchsia-400' },
    { key: 'done',        label: 'DONE',         dot: 'bg-emerald-400' },
  ];

  const priorityColor = { low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-orange-400', urgent: 'text-rose-400' };

  if (!project) return (
    <div className="min-h-screen bg-[#0A0612] flex items-center justify-center text-zinc-400">Loading…</div>
  );

  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100">
      <Topnav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link to="/projects" className="hover:text-zinc-300 transition">Projects</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-300">{project.name}</span>
          </nav>

          {/* Project header */}
          <header className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/30 to-violet-500/0 border border-white/10 grid place-items-center">
                <FolderKanban className="w-7 h-7 text-violet-300" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{project.name}</h1>
                <p className="text-zinc-400 text-sm mt-0.5">{project.description || 'No description'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] tracking-[0.15em] font-semibold px-3 py-1.5 rounded-full border ${
                project.status === 'archived'
                  ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {project.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>
          </header>
          {/* Members */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Members <span className="text-zinc-500 text-sm ml-1">{project.members?.length || 0}</span></h2>
              {user?.role === 'admin' && (
                <button onClick={() => setAddingMember(!addingMember)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 transition">
                  <UserPlus className="w-3.5 h-3.5" /> Add Member
                </button>
              )}
            </div>

            {addingMember && (
              <div className="flex gap-2 mb-4">
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/60 transition">
                  <option value="">Select user…</option>
                  {allUsers.filter((u) => !project.members?.some((m) => m._id === u._id)).map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <button onClick={addMember} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 transition">Add</button>
                <button onClick={() => setAddingMember(false)} className="px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/5 transition"><X className="w-4 h-4" /></button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {(project.members || []).map((m) => (
                <div key={m._id} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center text-xs font-semibold">
                    {m.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{m.name}</p>
                    <p className="text-[10px] text-zinc-500 capitalize">{m.role}</p>
                  </div>
                  {user?.role === 'admin' && m._id !== user.id && (
                    <button onClick={() => removeMember(m._id)} className="ml-1 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
          {/* Tasks kanban */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Tasks <span className="text-zinc-500 text-sm ml-1">{tasks.length}</span></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {COLS.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.key);
                return (
                  <div key={col.key} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-300">{col.label}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">{colTasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colTasks.map((t) => (
                        <div key={t._id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 group">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-white font-medium">{t.title}</p>
                            {user?.role === 'admin' && (
                              <button onClick={() => deleteTask(t._id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition shrink-0">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          {t.assignedTo && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center text-[9px] font-semibold">
                                {t.assignedTo.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-[11px] text-zinc-400">{t.assignedTo.name}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2 gap-2">
                            <span className={`text-[10px] font-semibold capitalize ${priorityColor[t.priority] || 'text-zinc-400'}`}>{t.priority}</span>
                            <select value={t.status} onChange={(e) => updateTaskStatus(t._id, e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-md px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none">
                              <option value="todo">Todo</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
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
        </main>
      </div>
    </div>
  );
}

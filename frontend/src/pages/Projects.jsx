import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [show, setShow] = useState(false);

  const load = () => api.get('/projects').then((r) => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setForm({ name: '', description: '' });
    setShow(false);
    load();
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShow(!show)} className="btn-primary">
            {show ? 'Cancel' : 'New Project'}
          </button>
        )}
      </header>

      {show && (
        <form onSubmit={create} className="card space-y-3">
          <input className="input" placeholder="Project name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="input" placeholder="Description" rows={3}
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary">Create</button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link key={p._id} to={`/projects/${p._id}`} className="card hover:border-indigo-500/40 transition">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{p.description || 'No description'}</p>
            <p className="text-xs text-zinc-500 mt-3">{p.members?.length || 0} members</p>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-zinc-500">No projects yet.</p>}
      </div>
    </div>
  );
}

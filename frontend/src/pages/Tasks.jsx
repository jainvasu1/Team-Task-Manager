import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { api.get('/tasks?mine=true').then((r) => setTasks(r.data)); }, []);

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">My Tasks</h1>
      <div className="card divide-y divide-white/5">
        {tasks.map((t) => (
          <div key={t._id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-xs text-zinc-400">{t.project?.name}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 capitalize">
              {t.status}
            </span>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-zinc-500 py-4">No tasks assigned.</p>}
      </div>
    </div>
  );
}

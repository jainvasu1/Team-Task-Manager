import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, FolderKanban } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';
import api from '../lib/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`).then((r) => setProject(r.data)).catch(() => {});
  }, [id]);

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
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';
import api from '../lib/api';

const COLORS = [
  'from-violet-500 to-indigo-500',
  'from-fuchsia-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-cyan-500 to-blue-500',
];

export default function Team() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    api.get('/users').then((r) => setMembers(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100">
      <Topnav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 space-y-8">
          <header>
            <h1 className="text-3xl font-semibold">Team</h1>
            <p className="text-zinc-400 text-sm mt-1">Manage your workspace members and roles.</p>
          </header>

          {members.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No members yet.</p>
            </div>
          ) : (
            <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((m, i) => (
                <div key={m._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${COLORS[i % COLORS.length]} grid place-items-center text-xl font-bold text-white shadow-lg`}>
                    {m.name?.[0]?.toUpperCase()}
                  </div>
                  <h3 className="mt-4 text-white font-semibold">{m.name}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{m.email}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-[10px] tracking-[0.15em] font-semibold px-2 py-1 rounded-full border capitalize ${
                      m.role === 'admin'
                        ? 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30'
                        : 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                    }`}>
                      {m.role}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(m.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

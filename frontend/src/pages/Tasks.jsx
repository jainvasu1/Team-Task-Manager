import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useAuth();
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
    </div>
  );
}

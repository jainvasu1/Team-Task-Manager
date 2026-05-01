import { Search, Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="flex items-center justify-between gap-4 px-2">
      <div className="relative w-full max-w-sm">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search tasks…"
          className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition"
        />
      </div>
      <button className="w-10 h-10 grid place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition">
        <Bell className="w-4 h-4" />
      </button>
    </div>
  );
}

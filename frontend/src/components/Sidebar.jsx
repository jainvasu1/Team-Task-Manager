import { NavLink } from 'react-router-dom';
import { Zap, LayoutGrid, FolderKanban, CheckSquare, Users, BarChart3, Settings, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 bg-[#0d0915] p-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-fuchsia-500/30">
          <Zap className="w-5 h-5 text-white" fill="white" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-tight">TaskFlow Pro</p>
          <p className="text-[9px] tracking-[0.2em] text-zinc-500 font-medium">PREMIUM PLAN</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-6 flex-1 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-white/[0.06] text-white border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
          <p className="text-[10px] text-zinc-500">High Velocity Team</p>
        </div>
        <MoreVertical className="w-4 h-4 text-zinc-500" />
      </div>
    </aside>
  );
}

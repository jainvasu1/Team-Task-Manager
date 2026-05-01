import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, LayoutGrid, FolderKanban, CheckSquare, Users, BarChart3, Settings, MoreVertical, LogOut, User } from 'lucide-react';
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
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
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
      <div ref={menuRef} className="mt-4 relative">
        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-full mb-2 left-0 right-0 rounded-xl border border-white/10 bg-[#13101a]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-xs text-white font-medium">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => { setMenuOpen(false); nav('/profile'); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-white transition"
            >
              <User className="w-3.5 h-3.5" /> View Profile
            </button>
            <button
              onClick={() => { setMenuOpen(false); nav('/settings'); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-300 hover:bg-white/[0.06] hover:text-white transition"
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </button>
            <div className="border-t border-white/5" />
            <button
              onClick={() => { logout(); nav('/login'); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Log out
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-zinc-500 capitalize">{user?.role || 'High Velocity Team'}</p>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 grid place-items-center rounded-lg hover:bg-white/10 transition"
          >
            <MoreVertical className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}

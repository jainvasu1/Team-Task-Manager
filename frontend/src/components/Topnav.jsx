import { NavLink, Link } from 'react-router-dom';
import { Zap, Bell, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/team', label: 'Team' },
];

export default function Topnav({ action }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0612]/80 backdrop-blur-xl">
      <div className="px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-semibold">
            TaskFlow
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm transition ${
                  isActive ? 'text-fuchsia-400' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 grid place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition">
            <Bell className="w-4 h-4" />
          </button>
          {action || (
            user?.role === 'admin' && (
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/30 hover:opacity-95 transition flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}

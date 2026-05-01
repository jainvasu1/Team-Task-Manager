import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 space-y-8">
        <Topbar />
        <header>
          <h1 className="text-3xl font-semibold">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">You have 8 tasks to complete today.</p>
        </header>
      </main>
    </div>
  );
}

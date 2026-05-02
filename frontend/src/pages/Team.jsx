import Sidebar from '../components/Sidebar';
import Topnav from '../components/Topnav';

export default function Team() {
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
        </main>
      </div>
    </div>
  );
}

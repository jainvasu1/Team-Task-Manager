import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0A0612] text-zinc-100 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </main>
    </div>
  );
}

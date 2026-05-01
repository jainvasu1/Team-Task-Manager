export default function StatCard({ icon: Icon, label, value, trend, trendType = 'up', accent = 'violet' }) {
  const accentMap = {
    violet: 'from-violet-500/30 to-violet-500/0 text-violet-300',
    fuchsia: 'from-fuchsia-500/30 to-fuchsia-500/0 text-fuchsia-300',
    emerald: 'from-emerald-500/30 to-emerald-500/0 text-emerald-300',
    rose: 'from-rose-500/30 to-rose-500/0 text-rose-300',
  };
  const trendColor =
    trendType === 'up' ? 'text-emerald-400' : trendType === 'down' ? 'text-rose-400' : 'text-zinc-400';

  // tiny inline sparkline bars
  const bars = [3, 5, 4, 6, 8, 5, 7, 9];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg grid place-items-center bg-gradient-to-br ${accentMap[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold ${trendColor}`}>{trend}</span>
        )}
      </div>
      <p className="mt-5 text-[10px] tracking-[0.2em] font-semibold text-zinc-500">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-semibold text-white mt-1">{value}</p>
        <div className="flex items-end gap-0.5 h-6">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-sm bg-gradient-to-t from-violet-500/40 to-fuchsia-500/70"
              style={{ height: `${h * 3}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

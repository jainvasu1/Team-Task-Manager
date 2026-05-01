const tagColors = {
  ACTIVE: 'from-violet-500 to-indigo-500',
  PLANNING: 'from-amber-500 to-orange-500',
  URGENT: 'from-fuchsia-500 to-rose-500',
};

export default function ProjectCard({ tag = 'ACTIVE', title, subtitle, progress = 0, daysLeft }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tagColors[tag]}`} />
      <div className="flex items-start justify-between">
        <span className={`text-[10px] tracking-[0.2em] font-bold bg-gradient-to-r ${tagColors[tag]} bg-clip-text text-transparent`}>
          {tag}
        </span>
        <div className="flex -space-x-2">
          {[0, 1].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0612] bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          ))}
          <div className="w-6 h-6 rounded-full border-2 border-[#0A0612] bg-white/10 grid place-items-center text-[9px] text-zinc-300">+8</div>
        </div>
      </div>
      <h3 className="mt-4 text-white font-semibold">{title}</h3>
      <p className="text-zinc-500 text-xs mt-1">{subtitle}</p>

      <div className="mt-5 flex items-center justify-between text-[11px]">
        <span className="text-zinc-400">{progress}% Complete</span>
        <span className="text-zinc-500">{daysLeft} days left</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${tagColors[tag]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

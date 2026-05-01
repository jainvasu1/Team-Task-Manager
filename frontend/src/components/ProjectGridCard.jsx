import { Link } from 'react-router-dom';

const accentMap = {
  violet: { icon: 'from-violet-500/30 to-violet-500/0 text-violet-300', bar: 'from-violet-500 via-fuchsia-500 to-pink-500' },
  amber: { icon: 'from-amber-500/30 to-amber-500/0 text-amber-300', bar: 'from-amber-500 via-orange-500 to-rose-500' },
  fuchsia: { icon: 'from-fuchsia-500/30 to-fuchsia-500/0 text-fuchsia-300', bar: 'from-fuchsia-500 via-pink-500 to-rose-500' },
  emerald: { icon: 'from-emerald-500/30 to-emerald-500/0 text-emerald-300', bar: 'from-emerald-500 via-teal-500 to-cyan-500' },
};

export default function ProjectGridCard({
  to = '#',
  icon: Icon,
  title,
  description,
  progress = 0,
  taskCount = 0,
  members = [],
  accent = 'violet',
  image,
  badge,
}) {
  const a = accentMap[accent] || accentMap.violet;

  return (
    <Link
      to={to}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 hover:border-white/20 transition relative overflow-hidden"
    >
      {image ? (
        <div className="-mx-5 -mt-5 mb-5 h-32 overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition" />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`w-10 h-10 rounded-lg grid place-items-center bg-gradient-to-br ${a.icon} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badge && (
            <span className="text-[10px] tracking-[0.2em] font-semibold text-violet-300 px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20">
              {badge}
            </span>
          )}
        </div>
        <div className="flex -space-x-2 shrink-0">
          {members.slice(0, 2).map((m, i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0612] bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          ))}
          {members.length > 2 && (
            <div className="w-6 h-6 rounded-full border-2 border-[#0A0612] bg-white/10 grid place-items-center text-[9px] text-zinc-300">
              +{members.length - 2}
            </div>
          )}
        </div>
      </div>

      <h3 className="mt-5 text-white font-semibold">{title}</h3>
      <p className="mt-1.5 text-zinc-500 text-xs leading-relaxed line-clamp-2">{description}</p>

      <div className="mt-5 flex items-center justify-between text-[11px]">
        <span className={`font-semibold bg-gradient-to-r ${a.bar} bg-clip-text text-transparent`}>
          {progress}% Complete
        </span>
        <span className="text-zinc-500">{taskCount} Tasks</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${a.bar}`} style={{ width: `${progress}%` }} />
      </div>
    </Link>
  );
}

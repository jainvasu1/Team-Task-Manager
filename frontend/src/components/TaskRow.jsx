import { Calendar } from 'lucide-react';

const priorityStyle = {
  URGENT: { bar: 'bg-rose-500', pill: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  MEDIUM: { bar: 'bg-amber-500', pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  LOW: { bar: 'bg-emerald-500', pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
};

const statusStyle = {
  'IN PROGRESS': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  BACKLOG: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  PLANNING: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  DONE: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
};

export default function TaskRow({ task, selected, onToggle }) {
  const p = priorityStyle[task.priority] || priorityStyle.MEDIUM;
  const s = statusStyle[task.status] || statusStyle.BACKLOG;

  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition">
      <span className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${p.bar}`} />
      <div className="pl-5 pr-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="mt-1 accent-fuchsia-500"
          />
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{task.title}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] tracking-[0.15em] font-semibold px-2 py-0.5 rounded border ${p.pill}`}>
                {task.priority}
              </span>
              <span className={`text-[9px] tracking-[0.15em] font-semibold px-2 py-0.5 rounded border ${s}`}>
                {task.status}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
              {task.assignee}
            </div>
          </div>
        </div>
        <div className="text-xs text-zinc-500 flex items-center gap-1 shrink-0">
          <Calendar className="w-3 h-3" /> {task.due}
        </div>
      </div>
    </div>
  );
}

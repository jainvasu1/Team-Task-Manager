import { Plus } from 'lucide-react';

const columns = [
  {
    key: 'todo',
    label: 'TO DO',
    dot: 'bg-violet-400',
    count: 4,
    cards: [
      { tag: 'RESEARCH', tagColor: 'text-fuchsia-400', title: 'Competitor analysis for TaskFlow', meta: 'Due Tomorrow' },
      { tag: 'CLIENT', tagColor: 'text-amber-400', title: 'Send project estimate to Acme Corp', meta: '2 Attachments' },
    ],
  },
  {
    key: 'in-progress',
    label: 'IN PROGRESS',
    dot: 'bg-fuchsia-400',
    count: 2,
    cards: [
      { tag: 'DESIGN', tagColor: 'text-violet-400', title: 'Refine landing page typography', meta: '' },
    ],
  },
  {
    key: 'done',
    label: 'DONE',
    dot: 'bg-emerald-400',
    count: 12,
    cards: [
      { tag: 'MEETING', tagColor: 'text-zinc-500', title: 'Weekly sync with engineering', meta: 'Completed 2h ago', faded: true },
    ],
  },
];

export default function TaskBoard() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">My Tasks Today</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.key} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-300">{col.label}</span>
              </div>
              <span className="text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">{col.count}</span>
            </div>

            <div className="mt-2 space-y-2">
              {col.cards.map((c, i) => (
                <div
                  key={i}
                  className={`rounded-xl border border-white/10 bg-white/[0.04] p-3 ${c.faded ? 'opacity-60' : ''}`}
                >
                  <p className={`text-[10px] tracking-[0.2em] font-bold ${c.tagColor}`}>{c.tag}</p>
                  <p className={`mt-1 text-sm ${c.faded ? 'text-zinc-400 line-through' : 'text-white'} font-medium`}>
                    {c.title}
                  </p>
                  {c.meta && <p className="text-[11px] text-zinc-500 mt-2">{c.meta}</p>}
                </div>
              ))}
              {col.key === 'done' && (
                <button className="w-full rounded-xl border border-dashed border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20 text-xs py-3 flex items-center justify-center gap-1 transition">
                  <Plus className="w-3 h-3" /> Add New Task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

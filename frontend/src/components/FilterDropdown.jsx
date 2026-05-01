import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const active = value && value !== 'all';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition ${
          active
            ? 'border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-300'
            : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]'
        }`}
      >
        {active ? `${label}: ${options.find((o) => o.value === value)?.label || value}` : label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 min-w-[140px] rounded-xl border border-white/10 bg-[#13101a]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
                value === opt.value
                  ? 'text-fuchsia-300 bg-fuchsia-500/10'
                  : 'text-zinc-300 hover:bg-white/[0.06]'
              }`}
            >
              {opt.label}
              {value === opt.value && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  badge?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  badge,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 group transition-colors duration-150 hover:bg-[var(--surface-2)]"
      >
        <span style={{ color: 'var(--muted)' }} className="shrink-0">
          {icon}
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-widest flex-1 text-left"
          style={{ color: 'var(--muted)' }}
        >
          {title}
        </span>
        {badge !== undefined && badge > 0 && (
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
            style={{
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
            }}
          >
            {badge}
          </span>
        )}
        <ChevronDown
          size={12}
          className="shrink-0 transition-transform duration-200"
          style={{
            color: 'var(--muted)',
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
        />
      </button>

      {open && <div>{children}</div>}
    </div>
  );
}

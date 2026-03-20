import { useUIStore } from '@/store/uiStore';

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text)' }}>
        {value}
      </span>
    </div>
  );
}

export default function DocStats() {
  const wordCount = useUIStore((s) => s.wordCount);
  const charCount = useUIStore((s) => s.charCount);

  return (
    <div className="px-4 pb-3">
      <div
        className="rounded-lg px-3 py-2"
        style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <StatItem label="Words" value={wordCount.toLocaleString()} />
        <StatItem label="Characters" value={charCount.toLocaleString()} />
      </div>
    </div>
  );
}

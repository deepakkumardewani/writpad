import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUIStore } from '@/store/uiStore';
import type { ConnectionStatus } from '@/types/collab';

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string | null; color: string; pulse: boolean }
> = {
  live:    { label: null,       color: '#4A8C42', pulse: false },
  local:   { label: 'Local',   color: '#7A7878', pulse: false },
  saving:  { label: 'Saving…', color: '#D4872A', pulse: true  },
  saved:   { label: 'Saved',   color: '#4A8C42', pulse: false },
  offline: { label: 'Offline', color: '#E05252', pulse: false },
};

function formatSavedTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface StatusPillProps {
  status: ConnectionStatus;
}

export default function StatusPill({ status }: StatusPillProps) {
  const lastSavedAt = useUIStore((s) => s.lastSavedAt);
  const wordCount = useUIStore((s) => s.wordCount);
  const charCount = useUIStore((s) => s.charCount);

  // Treat "live" as "saved" visually — status reverts to "live" after save debounce,
  // but the user expects to always see the last save state.
  const displayStatus = status === 'live' ? 'saved' : status;
  const displayConfig = STATUS_CONFIG[displayStatus];

  // Nothing to show: live with no prior save
  if (displayStatus === 'saved' && !lastSavedAt) return null;

  const { label: displayLabel, color: displayColor, pulse: displayPulse } = displayConfig;

  const pill = (
    <div
      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full cursor-default"
      style={{ backgroundColor: 'var(--surface-2)' }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${displayPulse ? 'animate-pulse-dot' : ''}`}
        style={{ backgroundColor: displayColor }}
      />
      {displayLabel && (
        <span
          className="text-[11px] font-medium hidden sm:inline"
          style={{ color: 'var(--muted)' }}
        >
          {displayLabel}
        </span>
      )}
    </div>
  );

  // "saved" (or live-treated-as-saved) gets a tooltip
  if (displayStatus === 'saved' && lastSavedAt) {
    return (
      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger>{pill}</TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="flex flex-col gap-0.5 text-xs"
            style={{
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            <p className="font-medium">Saved at {formatSavedTime(lastSavedAt)}</p>
            <p style={{ color: 'var(--muted)' }}>
              {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return pill;
}

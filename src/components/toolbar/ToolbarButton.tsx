import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
  shortcut?: string;
  disabled?: boolean;
}

const BUTTON_BASE_CLASS = [
  'flex items-center justify-center w-7 h-7 rounded-md',
  'transition-colors duration-150',
  'disabled:opacity-30 disabled:cursor-not-allowed',
].join(' ');

const BUTTON_ACTIVE_CLASS = 'bg-[var(--accent-light)] text-[var(--accent)]';
const BUTTON_INACTIVE_CLASS =
  'text-[var(--muted)] hover:bg-[var(--accent-light)] hover:text-[var(--text)]';

export default function ToolbarButton({
  onClick,
  isActive = false,
  children,
  title,
  shortcut,
  disabled = false,
}: ToolbarButtonProps) {
  const className = [
    BUTTON_BASE_CLASS,
    isActive ? BUTTON_ACTIVE_CLASS : BUTTON_INACTIVE_CLASS,
  ].join(' ');

  if (!title) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} className={className}>
        {children}
      </button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button type="button" onClick={onClick} disabled={disabled} className={className} />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <span>{title}</span>
        {shortcut && (
          <kbd data-slot="kbd" className="ml-1 font-mono text-[10px] opacity-60">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

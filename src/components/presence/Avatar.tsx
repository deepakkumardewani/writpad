import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  color: string;
  size?: number;
  isSelf?: boolean;
  className?: string;
}

export default function Avatar({
  name,
  color,
  size = 30,
  isSelf = false,
  className = '',
}: AvatarProps) {
  const initials = useMemo(() => getInitials(name), [name]);
  const tooltipText = isSelf ? `${name} (you)` : name;

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <div
              className={`flex items-center justify-center rounded-full text-white font-semibold shrink-0 select-none cursor-default ${className}`}
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                fontSize: size * 0.38,
                lineHeight: 1,
              }}
            />
          }
        >
          {initials}
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="text-xs"
          style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

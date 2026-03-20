import { useMemo } from 'react';
import type { AwarenessState } from '@/types/user';
import Avatar from './Avatar';
import { Badge } from '@/components/ui/badge';

interface AvatarStackProps {
  states: AwarenessState[];
  selfClientId: number | null;
}

const MAX_VISIBLE = 5;

export default function AvatarStack({ states, selfClientId }: AvatarStackProps) {
  const sortedStates = useMemo(() => {
    // Put self first, then others
    return [...states].sort((a, b) => {
      if (a.clientId === selfClientId) return -1;
      if (b.clientId === selfClientId) return 1;
      return 0;
    });
  }, [states, selfClientId]);

  const visible = sortedStates.slice(0, MAX_VISIBLE);
  const overflow = sortedStates.length - MAX_VISIBLE;

  if (states.length === 0) return null;

  return (
    <div className="flex items-center">
      {visible.map((state, index) => (
        <div
          key={state.clientId}
          className="transition-opacity duration-200"
          style={{ marginLeft: index === 0 ? 0 : -6, zIndex: MAX_VISIBLE - index }}
        >
          <Avatar
            name={state.user.name || 'Anonymous'}
            color={state.user.color}
            size={30}
            isSelf={state.clientId === selfClientId}
          />
        </div>
      ))}
      {overflow > 0 && (
        <Badge
          variant="secondary"
          className="ml-1 text-xs h-[30px] px-2"
          style={{ backgroundColor: 'var(--surface-2)', color: 'var(--muted)' }}
        >
          +{overflow}
        </Badge>
      )}
    </div>
  );
}

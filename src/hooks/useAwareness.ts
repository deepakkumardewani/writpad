import { useEffect, useState, useCallback } from 'react';
import type { Awareness } from 'y-protocols/awareness';
import type { AwarenessState, AwarenessUser } from '@/types/user';

interface UseAwarenessResult {
  states: AwarenessState[];
}

export function useAwareness(
  awareness: Awareness | null,
  user: AwarenessUser | null,
): UseAwarenessResult {
  const [states, setStates] = useState<AwarenessState[]>([]);

  // Set local awareness state when user changes
  useEffect(() => {
    if (!awareness || !user) return;
    awareness.setLocalStateField('user', user);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awareness, user?.id, user?.name, user?.color]);

  const updateStates = useCallback(() => {
    if (!awareness) return;

    const newStates: AwarenessState[] = [];
    awareness.getStates().forEach((state, clientId) => {
      const typedState = state as {
        user?: AwarenessUser;
        cursor?: AwarenessState['cursor'];
        isTyping?: boolean;
      };
      if (typedState.user) {
        newStates.push({
          clientId,
          user: typedState.user,
          cursor: typedState.cursor ?? null,
          isTyping: typedState.isTyping ?? false,
        });
      }
    });
    setStates(newStates);
  }, [awareness]);

  useEffect(() => {
    if (!awareness) return;

    awareness.on('change', updateStates);
    updateStates();

    return () => {
      awareness.off('change', updateStates);
    };
  }, [awareness, updateStates]);

  return { states };
}

import type { AwarenessState } from '@/types/user';
import Avatar from './Avatar';
import TypingIndicator from './TypingIndicator';

interface PresenceListProps {
  states: AwarenessState[];
  selfClientId: number | null;
}

export default function PresenceList({ states, selfClientId }: PresenceListProps) {
  const others = states.filter((s) => s.clientId !== selfClientId);

  return (
    <div className="px-4 py-3">
      {others.length === 0 ? (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          No one else is here yet
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {others.map((state) => (
            <div key={state.clientId} className="flex items-center gap-2">
              <Avatar name={state.user.name || 'Anonymous'} color={state.user.color} size={22} />
              <span className="text-sm truncate" style={{ color: 'var(--text)' }}>
                {state.user.name || 'Anonymous'}
              </span>
              {state.isTyping && <TypingIndicator />}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto shrink-0"
                style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                {state.isTyping ? 'Typing' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

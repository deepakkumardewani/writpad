import { useMemo } from 'react';
import type { ActivityEvent, ActivityType } from '@/types/activity';
import Avatar from '@/components/presence/Avatar';
import { formatRelativeTime } from '@/lib/utils';

interface ActivityItemProps {
  event: ActivityEvent;
}

const ACTIVITY_TEXT: Record<ActivityType, string> = {
  joined: 'joined the document',
  edited: 'made edits',
  commented: 'added a comment',
  exported: 'exported the document',
  left: 'left the document',
};

export default function ActivityItem({ event }: ActivityItemProps) {
  const timeText = useMemo(() => formatRelativeTime(event.timestamp), [event.timestamp]);

  return (
    <div className="flex items-start gap-2">
      <Avatar name={event.userName} color={event.userColor} size={22} />
      <div className="flex flex-col min-w-0">
        <span className="text-xs leading-tight" style={{ color: 'var(--text)' }}>
          <span className="font-medium">{event.userName}</span>{' '}
          {ACTIVITY_TEXT[event.type]}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
          {timeText}
        </span>
      </div>
    </div>
  );
}

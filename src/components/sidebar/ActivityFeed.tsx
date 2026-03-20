import { useActivityStore } from '@/store/activityStore';
import ActivityItem from './ActivityItem';

export default function ActivityFeed() {
  const activities = useActivityStore((s) => s.activities);

  return (
    <div className="px-4 py-3">
      {activities.length === 0 ? (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          No recent activity
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {activities.map((event) => (
            <ActivityItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

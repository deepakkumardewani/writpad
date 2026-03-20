import { useMemo } from 'react';
import type { CommentObject } from '@/types/comment';
import Avatar from '@/components/presence/Avatar';
import { formatRelativeTime } from '@/lib/utils';

interface CommentItemProps {
  comment: CommentObject;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const timeText = useMemo(
    () => formatRelativeTime(new Date(comment.createdAt).getTime()),
    [comment.createdAt],
  );

  return (
    <div className="flex gap-2">
      <Avatar
        name={comment.authorName}
        color={comment.authorColor}
        size={22}
        className="mt-0.5"
      />
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
            {comment.authorName}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
            {timeText}
          </span>
        </div>
        <p className="text-xs mt-0.5 break-words" style={{ color: 'var(--text)' }}>
          {comment.text}
        </p>
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
import type * as Y from 'yjs';
import type { CommentObject } from '@/types/comment';
import CommentItem from './CommentItem';
import AddCommentInput from './AddCommentInput';

interface CommentsListProps {
  yComments: Y.Array<CommentObject>;
}

export default function CommentsList({ yComments }: CommentsListProps) {
  const [comments, setComments] = useState<CommentObject[]>([]);

  useEffect(() => {
    const handler = (): void => {
      setComments(yComments.toArray());
    };

    yComments.observe(handler);
    handler(); // initial sync

    return () => {
      yComments.unobserve(handler);
    };
  }, [yComments]);

  const handleAddComment = useCallback(
    (comment: CommentObject) => {
      yComments.push([comment]);
    },
    [yComments],
  );

  // Display newest first
  const reversed = [...comments].reverse();

  return (
    <div className="px-4 py-3">
      <AddCommentInput onSubmit={handleAddComment} />
      {reversed.length === 0 ? (
        <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
          No comments yet
        </p>
      ) : (
        <div className="flex flex-col gap-3 mt-3">
          {reversed.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

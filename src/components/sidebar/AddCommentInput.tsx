import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { CommentObject } from '@/types/comment';
import { useUserStore } from '@/store/userStore';
import { useActivityStore } from '@/store/activityStore';
import { generateId } from '@/lib/nanoid';

interface AddCommentInputProps {
  onSubmit: (comment: CommentObject) => void;
}

export default function AddCommentInput({ onSubmit }: AddCommentInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState('');
  const userName = useUserStore((s) => s.name);
  const userColor = useUserStore((s) => s.color);
  const addActivity = useActivityStore((s) => s.addActivity);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const comment: CommentObject = {
      id: generateId(10),
      authorName: userName,
      authorColor: userColor,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    onSubmit(comment);
    setText('');
    setIsExpanded(false);

    addActivity({
      id: generateId(10),
      type: 'commented',
      userName,
      userColor,
      timestamp: Date.now(),
    });
  }, [text, userName, userColor, onSubmit, addActivity]);

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="w-full justify-start text-xs h-8"
        style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
      >
        + Add comment
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        autoFocus
        rows={3}
        className="w-full resize-none rounded-md px-3 py-2 text-xs outline-none"
        style={{
          backgroundColor: 'var(--surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--accent)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
        }}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="text-white text-xs h-7"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Submit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setIsExpanded(false); setText(''); }}
          className="text-xs h-7"
          style={{ color: 'var(--muted)' }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

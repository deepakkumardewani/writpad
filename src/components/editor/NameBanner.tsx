import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NameBannerProps {
  onSubmit: (name: string) => void;
}

export default function NameBanner({ onSubmit }: NameBannerProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  }, [value, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="flex items-center justify-center gap-3 rounded-xl px-6 py-4 mb-6"
      style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What's your name?"
        className="max-w-[240px] bg-transparent border-[var(--border-med)] text-[var(--text)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--accent)]"
      />
      <Button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="text-white font-medium"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        Join
      </Button>
    </div>
  );
}

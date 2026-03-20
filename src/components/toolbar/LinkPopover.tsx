import { useState, useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link2, ExternalLink, Trash2, Check } from 'lucide-react';

interface LinkPopoverProps {
  editor: Editor;
  isActive: boolean;
}

function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    // Allow bare domains by prepending https:// if no protocol given
    const normalised = value.startsWith('http') ? value : `https://${value}`;
    new URL(normalised);
    return true;
  } catch {
    return false;
  }
}

function normaliseUrl(value: string): string {
  return value.startsWith('http') ? value : `https://${value}`;
}

export default function LinkPopover({ editor, isActive }: LinkPopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [invalid, setInvalid] = useState(false);

  // Pre-populate when editing an existing link
  useEffect(() => {
    if (open) {
      const existing = editor.getAttributes('link').href as string | undefined;
      setUrl(existing ?? '');
      setInvalid(false);
    }
  }, [open, editor]);

  const handleApply = useCallback(() => {
    if (!isValidUrl(url)) {
      setInvalid(true);
      return;
    }
    editor.chain().focus().setLink({ href: normaliseUrl(url) }).run();
    setOpen(false);
  }, [editor, url]);

  const handleRemove = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
  }, [editor]);

  const handleOpenLink = useCallback(() => {
    const href = editor.getAttributes('link').href as string | undefined;
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
  }, [editor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApply();
      }
      if (e.key === 'Escape') setOpen(false);
    },
    [handleApply],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={[
              'flex items-center justify-center w-7 h-7 rounded-md',
              'transition-colors duration-150',
              isActive
                ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                : 'text-[var(--muted)] hover:bg-[var(--accent-light)] hover:text-[var(--text)]',
            ].join(' ')}
            title="Link"
          />
        }
      >
        <Link2 size={15} />
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="w-80 p-3"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>
          Insert link
        </p>

        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setInvalid(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            autoFocus
            className={[
              'flex-1 h-8 text-sm bg-transparent',
              invalid
                ? 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]'
                : 'focus-visible:ring-[var(--accent)]',
            ].join(' ')}
            style={{ color: 'var(--text)', borderColor: invalid ? 'var(--destructive)' : undefined }}
          />
          <Button
            size="sm"
            onClick={handleApply}
            className="h-8 px-3 text-white shrink-0"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Check size={14} />
          </Button>
        </div>

        {invalid && (
          <p className="text-xs mt-1.5" style={{ color: 'var(--destructive)' }}>
            Enter a valid URL
          </p>
        )}

        {/* Actions for existing links */}
        {isActive && (
          <div className="flex gap-1 mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={handleOpenLink}
              className="flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors duration-150 hover:bg-[var(--accent-light)]"
              style={{ color: 'var(--muted)' }}
            >
              <ExternalLink size={12} />
              Open
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors duration-150 hover:bg-red-500/10"
              style={{ color: 'var(--destructive)' }}
            >
              <Trash2 size={12} />
              Remove
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

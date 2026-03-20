import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { copyToClipboard } from '@/lib/utils';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareModal({ open, onOpenChange }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--text)' }}>Share this document</DialogTitle>
          <DialogDescription style={{ color: 'var(--muted)' }}>
            Anyone with this link can edit — no account needed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-2">
          <Input
            value={url}
            readOnly
            className="bg-transparent text-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          />
          <Button
            onClick={handleCopy}
            className="shrink-0 text-white font-medium min-w-[80px]"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

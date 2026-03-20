import { useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { useUIStore } from '@/store/uiStore';
import { WORD_COUNT_DEBOUNCE_MS } from '@/lib/constants';

export function useWordCount(editor: Editor | null): number {
  const setWordCount = useUIStore((s) => s.setWordCount);
  const setCharCount = useUIStore((s) => s.setCharCount);
  const wordCount = useUIStore((s) => s.wordCount);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = (): void => {
      const text = editor.state.doc.textContent;
      const words = text.split(/\s+/).filter(Boolean).length;
      const chars = text.length;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setWordCount(words);
        setCharCount(chars);
      }, WORD_COUNT_DEBOUNCE_MS);
    };

    editor.on('update', handleUpdate);
    // Initial count
    handleUpdate();

    return () => {
      editor.off('update', handleUpdate);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [editor, setWordCount, setCharCount]);

  return wordCount;
}

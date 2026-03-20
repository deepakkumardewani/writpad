import { useState, useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

interface HeadingItem {
  level: 1 | 2 | 3;
  text: string;
  pos: number;
}

function extractHeadings(editor: Editor): HeadingItem[] {
  const items: HeadingItem[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading' && node.attrs.level <= 3) {
      items.push({
        level: node.attrs.level as 1 | 2 | 3,
        text: node.textContent,
        pos,
      });
    }
  });
  return items;
}

const INDENT: Record<1 | 2 | 3, string> = {
  1: 'pl-0',
  2: 'pl-3',
  3: 'pl-6',
};

interface TableOfContentsProps {
  editor: Editor;
}

export default function TableOfContents({ editor }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    const handleUpdate = (): void => {
      setHeadings(extractHeadings(editor));
    };

    editor.on('update', handleUpdate);
    // Initial extraction
    handleUpdate();

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  const handleClick = useCallback(
    (pos: number) => {
      editor.chain().focus().setTextSelection(pos + 1).run();
      // Scroll the heading into view
      const { view } = editor;
      const domPos = view.domAtPos(pos + 1);
      if (domPos.node instanceof Element) {
        domPos.node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (domPos.node.parentElement) {
        domPos.node.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [editor],
  );

  if (headings.length === 0) {
    return (
      <div className="px-4 pb-3">
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          No headings yet
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-3 flex flex-col gap-0.5">
      {headings.map((h, i) => (
        <button
          key={`${h.pos}-${i}`}
          type="button"
          onClick={() => handleClick(h.pos)}
          className={[
            INDENT[h.level],
            'text-left text-xs py-0.5 truncate rounded transition-colors duration-150',
            'hover:text-[var(--text)]',
          ].join(' ')}
          style={{ color: 'var(--muted)' }}
          title={h.text}
        >
          {h.text || '(empty heading)'}
        </button>
      ))}
    </div>
  );
}

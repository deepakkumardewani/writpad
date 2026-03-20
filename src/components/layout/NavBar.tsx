import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import AvatarStack from '@/components/presence/AvatarStack';
import ShareModal from '@/components/modals/ShareModal';
import StatusPill from '@/components/layout/StatusPill';
import type { AwarenessState } from '@/types/user';
import type { ConnectionStatus } from '@/types/collab';
import { useUIStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import { useActivityStore } from '@/store/activityStore';
import { exportAsText } from '@/lib/exportDoc';
import { generateId } from '@/lib/nanoid';
import { TITLE_DEBOUNCE_MS } from '@/lib/constants';
import { Download, PanelRight } from 'lucide-react';
import type * as Y from 'yjs';

interface NavBarProps {
  yTitle: Y.Text;
  ydoc: Y.Doc;
  states: AwarenessState[];
  selfClientId: number | null;
  connectionStatus: ConnectionStatus;
  roomId: string;
  /** Used for export — pass a ref value from DocPage */
  titleRef: React.RefObject<string>;
  editor: { getHTML: () => string } | null;
}

export default function NavBar({
  yTitle,
  ydoc,
  states,
  selfClientId,
  connectionStatus,
  roomId,
  titleRef,
  editor,
}: NavBarProps) {
  const [titleValue, setTitleValue] = useState(yTitle.toString() || '');
  const [titleFocused, setTitleFocused] = useState(false);
  const shareModalOpen = useUIStore((s) => s.shareModalOpen);
  const toggleShareModal = useUIStore((s) => s.toggleShareModal);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const userName = useUserStore((s) => s.name);
  const userColor = useUserStore((s) => s.color);
  const addActivity = useActivityStore((s) => s.addActivity);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Observe remote title changes
  useEffect(() => {
    const handler = (): void => {
      setTitleValue(yTitle.toString());
    };
    yTitle.observe(handler);
    return () => yTitle.unobserve(handler);
  }, [yTitle]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setTitleValue(newValue);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        ydoc.transact(() => {
          yTitle.delete(0, yTitle.length);
          yTitle.insert(0, newValue);
        });
        try {
          localStorage.setItem(`writpad_doc_title_${roomId}`, newValue);
        } catch {
          // Ignore storage errors
        }
      }, TITLE_DEBOUNCE_MS);
    },
    [yTitle, ydoc, roomId],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleExport = useCallback(() => {
    if (!editor) return;
    const title = titleRef.current ?? 'untitled';
    exportAsText(editor.getHTML(), title);
    addActivity({
      id: generateId(10),
      type: 'exported',
      userName,
      userColor,
      timestamp: Date.now(),
    });
  }, [editor, titleRef, addActivity, userName, userColor]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 grid grid-cols-3 items-center px-4 h-[52px] shrink-0"
        style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
          >
            ✦ Writpad
          </span>
        </div>

        {/* Centre: Title — grid column keeps it absolutely centered */}
        <div className="flex justify-center">
          <input
            value={titleValue}
            onChange={handleTitleChange}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            placeholder="Untitled document"
            className="w-full max-w-[360px] text-center text-sm bg-transparent border-b outline-none font-serif transition-colors duration-150"
            style={{
              color: 'var(--text)',
              fontFamily: "'Lora', serif",
              borderColor: titleFocused
                ? 'var(--accent)'
                : titleValue
                  ? 'transparent'
                  : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!titleFocused) {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-med)';
              }
            }}
            onMouseLeave={(e) => {
              if (!titleFocused) {
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
              }
            }}
          />
        </div>

        {/* Right: Status + Avatars + Export + Share + Sidebar toggle */}
        <div className="flex items-center gap-2 justify-end">
          <StatusPill status={connectionStatus} />

          <AvatarStack states={states} selfClientId={selfClientId} />

          {/* Export */}
          <Popover>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-150 text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  title="Export"
                />
              }
            >
              <Download size={15} />
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-1"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="text-xs"
                style={{ color: 'var(--text)' }}
              >
                Export as .txt
              </Button>
            </PopoverContent>
          </Popover>

          {/* Share */}
          <Button
            onClick={toggleShareModal}
            size="sm"
            className="text-white text-xs font-medium rounded-lg h-7 px-3"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Share
          </Button>

          {/* Sidebar toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-150"
            style={{
              color: sidebarOpen ? 'var(--accent)' : 'var(--muted)',
              backgroundColor: sidebarOpen ? 'var(--accent-light)' : 'transparent',
            }}
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <PanelRight size={15} />
          </button>
        </div>
      </nav>

      <ShareModal open={shareModalOpen} onOpenChange={toggleShareModal} />
    </>
  );
}

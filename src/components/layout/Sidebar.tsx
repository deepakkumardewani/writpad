import type { Editor } from '@tiptap/react';
import type * as Y from 'yjs';
import type { AwarenessState } from '@/types/user';
import type { CommentObject } from '@/types/comment';
import { User, Users, List, Activity, MessageSquare } from 'lucide-react';
import CollapsibleSection from '@/components/sidebar/CollapsibleSection';
import UserPanel from '@/components/sidebar/UserPanel';
import DocStats from '@/components/sidebar/DocStats';
import PresenceList from '@/components/presence/PresenceList';
import ActivityFeed from '@/components/sidebar/ActivityFeed';
import CommentsList from '@/components/sidebar/CommentsList';
import TableOfContents from '@/components/sidebar/TableOfContents';
import { useActivityStore } from '@/store/activityStore';

interface SidebarProps {
  userName: string;
  userColor: string;
  onNameChange: (name: string) => void;
  states: AwarenessState[];
  selfClientId: number | null;
  yComments: Y.Array<CommentObject>;
  editor: Editor | null;
}

const ICON_SIZE = 13;

export default function Sidebar({
  userName,
  userColor,
  onNameChange,
  states,
  selfClientId,
  yComments,
  editor,
}: SidebarProps) {
  const activities = useActivityStore((s) => s.activities);
  const others = states.filter((s) => s.clientId !== selfClientId);

  return (
    <aside
      className="w-[240px] h-full shrink-0 overflow-y-auto hidden lg:flex lg:flex-col"
      style={{
        backgroundColor: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
      }}
    >
      {/* You — user panel + doc stats */}
      <CollapsibleSection
        title="You"
        icon={<User size={ICON_SIZE} />}
        defaultOpen
      >
        <UserPanel name={userName} color={userColor} onNameChange={onNameChange} />
        <DocStats />
      </CollapsibleSection>

      <div className="h-px mx-4" style={{ backgroundColor: 'var(--border)' }} />

      {/* Outline / Table of Contents */}
      <CollapsibleSection
        title="Outline"
        icon={<List size={ICON_SIZE} />}
        defaultOpen
      >
        {editor ? (
          <TableOfContents editor={editor} />
        ) : (
          <div className="px-4 pb-3">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Loading…
            </p>
          </div>
        )}
      </CollapsibleSection>

      <div className="h-px mx-4" style={{ backgroundColor: 'var(--border)' }} />

      {/* Active now */}
      <CollapsibleSection
        title="Active now"
        icon={<Users size={ICON_SIZE} />}
        badge={others.length}
        defaultOpen
      >
        <PresenceList states={states} selfClientId={selfClientId} />
      </CollapsibleSection>

      <div className="h-px mx-4" style={{ backgroundColor: 'var(--border)' }} />

      {/* Activity */}
      <CollapsibleSection
        title="Activity"
        icon={<Activity size={ICON_SIZE} />}
        badge={activities.length}
        defaultOpen={false}
      >
        <ActivityFeed />
      </CollapsibleSection>

      <div className="h-px mx-4" style={{ backgroundColor: 'var(--border)' }} />

      {/* Comments */}
      <CollapsibleSection
        title="Comments"
        icon={<MessageSquare size={ICON_SIZE} />}
        defaultOpen
      >
        <CommentsList yComments={yComments} />
      </CollapsibleSection>
    </aside>
  );
}

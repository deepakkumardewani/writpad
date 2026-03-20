import { useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import UnderlineExt from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useYDoc } from "@/hooks/useYDoc";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useAwareness } from "@/hooks/useAwareness";
import { useLocalUser } from "@/hooks/useLocalUser";
import { useWordCount } from "@/hooks/useWordCount";
import { useUIStore } from "@/store/uiStore";
import { useActivityStore } from "@/store/activityStore";
import { CollabContext } from "@/hooks/useCollabContext";
import NavBar from "@/components/layout/NavBar";
import Toolbar from "@/components/layout/Toolbar";
import EditorArea from "@/components/layout/EditorArea";
import Sidebar from "@/components/layout/Sidebar";
import NameBanner from "@/components/editor/NameBanner";
import type { CommentObject } from "@/types/comment";
import type { AwarenessUser } from "@/types/user";
import { generateId } from "@/lib/nanoid";
import {
  AUTOSAVE_DEBOUNCE_MS,
  SAVED_REVERT_MS,
  ACTIVITY_EDIT_COOLDOWN_MS,
  TYPING_TIMEOUT_MS,
} from "@/lib/constants";

const DEFAULT_CONTENT = `<p>Hi, this is a collaborative document.</p><p>Feel free to edit and collaborate in real-time!</p>`;


export default function DocPage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return (
      <div style={{ color: "var(--text)", padding: 40 }}>Invalid room ID</div>
    );
  }

  return <DocPageInner roomId={roomId} />;
}

interface DocPageInnerProps {
  roomId: string;
}

function DocPageInner({ roomId }: DocPageInnerProps) {
  const { ydoc } = useYDoc(roomId);
  const {
    provider,
    status: providerStatus,
  } = useCollaboration(ydoc, roomId);
  const { user, isNameSet, setName } = useLocalUser();

  const awarenessUser: AwarenessUser | null = useMemo(() => {
    if (!user.name) return null;
    return { id: user.id, name: user.name, color: user.color };
  }, [user.id, user.name, user.color]);

  const awareness = provider?.awareness ?? null;
  const { states } = useAwareness(awareness, awarenessUser);

  const connectionStatus = useUIStore((s) => s.connectionStatus);
  const setConnectionStatus = useUIStore((s) => s.setConnectionStatus);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const addActivity = useActivityStore((s) => s.addActivity);

  // Keep a ref to providerStatus for use in stale closures (onUpdate callback)
  const providerStatusRef = useRef(providerStatus);
  providerStatusRef.current = providerStatus;

  // Map provider status to connection status
  useEffect(() => {
    if (providerStatus === "connected") {
      setConnectionStatus("live");
    } else if (providerStatus === "disconnected") {
      setConnectionStatus("offline");
    } else {
      setConnectionStatus("local");
    }
  }, [providerStatus, setConnectionStatus]);

  // Y.js shared types
  const yTitle = useMemo(() => ydoc.getText("title"), [ydoc]);
  const yComments = useMemo(
    () => ydoc.getArray<CommentObject>("comments"),
    [ydoc],
  );

  // Track title for toolbar export
  const titleRef = useRef("");
  useEffect(() => {
    const handler = (): void => {
      titleRef.current = yTitle.toString();
    };
    yTitle.observe(handler);
    handler();
    return () => yTitle.unobserve(handler);
  }, [yTitle]);

  // Auto-save refs
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEditActivityRef = useRef<number>(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Editor — created once provider is synced (following TipTap collab example)
  const editor = useEditor(
    {
      enableContentCheck: true,
      onContentError: ({ disableCollaboration }) => {
        disableCollaboration();
      },
      onCreate: ({ editor: currentEditor }) => {
        if (provider) {
          provider.on("synced", () => {
            if (currentEditor.isEmpty) {
              currentEditor.commands.setContent(DEFAULT_CONTENT);
            }
          });
        }
      },
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Collaboration.extend().configure({ document: ydoc }),
        // CollaborationCaret crashes on mount if provider is null — only include when ready
        ...(provider
          ? [
              CollaborationCaret.extend().configure({
                provider,
                // Mirror y-tiptap's defaultCursorBuilder: wrap label in \u2060 word-joiners
                // so Chrome's contenteditable incremental repaint never treats the caret
                // span as "empty" and skips rendering it.
                render(user: { name: string; color: string }) {
                  const cursor = document.createElement("span");
                  cursor.classList.add("collaboration-carets__caret");
                  cursor.setAttribute("style", `border-color: ${user.color}`);

                  const label = document.createElement("div");
                  label.classList.add("collaboration-carets__label");
                  label.setAttribute("style", `background-color: ${user.color}`);
                  label.insertBefore(document.createTextNode(user.name), null);

                  // \u2060 (word joiner) flanks prevent Chrome from treating the
                  // inline span as empty, fixing intermittent caret invisibility
                  cursor.insertBefore(document.createTextNode("\u2060"), null);
                  cursor.insertBefore(label, null);
                  cursor.insertBefore(document.createTextNode("\u2060"), null);

                  return cursor;
                },
              }),
            ]
          : []),
        UnderlineExt,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Link.configure({ openOnClick: false }),
      ],
      editorProps: {
        attributes: {
          class: "ProseMirror focus:outline-none",
        },
      },
      onUpdate: ({ transaction }) => {
        // Only track typing for local changes, not remote sync
        const isRemote = transaction.getMeta("y-sync$");
        if (!isRemote && awareness) {
          awareness.setLocalStateField("isTyping", true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            awareness.setLocalStateField("isTyping", false);
          }, TYPING_TIMEOUT_MS);
        }

        // Auto-save status cycle
        setConnectionStatus("saving");

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (revertTimeoutRef.current) clearTimeout(revertTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(() => {
          setConnectionStatus("saved");
          revertTimeoutRef.current = setTimeout(() => {
            setConnectionStatus(
              providerStatusRef.current === "connected" ? "live" : "local",
            );
          }, SAVED_REVERT_MS);
        }, AUTOSAVE_DEBOUNCE_MS);

        // Activity event with cooldown
        const now = Date.now();
        if (now - lastEditActivityRef.current > ACTIVITY_EDIT_COOLDOWN_MS) {
          lastEditActivityRef.current = now;
          addActivity({
            id: generateId(10),
            type: "edited",
            userName: user.name || "Anonymous",
            userColor: user.color,
            timestamp: now,
          });
        }
      },
    },
    // Recreate editor once provider is ready (synced content arrives async via onCreate)
    provider ? [ydoc, provider] : undefined,
  );

  // Update cursor user info when name/color changes (following TipTap collab example)
  useEffect(() => {
    if (!editor || !editor.commands.updateUser) return;
    editor
      .chain()
      .focus()
      .updateUser({
        name: user.name || "Anonymous",
        color: user.color,
      })
      .run();
  }, [editor, user.name, user.color]);

  // Word count
  useWordCount(editor);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (revertTimeoutRef.current) clearTimeout(revertTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Fire "joined" activity when name is set
  useEffect(() => {
    if (isNameSet && user.name) {
      addActivity({
        id: generateId(10),
        type: "joined",
        userName: user.name,
        userColor: user.color,
        timestamp: Date.now(),
      });
    }
    // Only fire once when name is set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNameSet]);

  const selfClientId = awareness?.clientID ?? null;

  return (
    <CollabContext.Provider
      value={{ ydoc, provider, status: providerStatus, roomId }}
    >
      <div
        className="flex flex-col h-screen"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <NavBar
          yTitle={yTitle}
          ydoc={ydoc}
          states={states}
          selfClientId={selfClientId}
          connectionStatus={connectionStatus}
          roomId={roomId}
          titleRef={titleRef}
          editor={editor}
        />
        <Toolbar editor={editor} />

        <div className="flex flex-1 overflow-hidden">
          <EditorArea>
            {!isNameSet && <NameBanner onSubmit={setName} />}
            {!provider ? (
              <div className="flex items-center justify-center py-20">
                <span className="text-sm" style={{ color: "var(--muted)" }}>
                  Loading document...
                </span>
              </div>
            ) : editor ? (
              <EditorContent editor={editor} />
            ) : null}
          </EditorArea>

          <div className={sidebarOpen ? 'h-full' : 'hidden'}>
            <Sidebar
              userName={user.name}
              userColor={user.color}
              onNameChange={setName}
              states={states}
              selfClientId={selfClientId}
              yComments={yComments}
              editor={editor}
            />
          </div>
        </div>
      </div>
    </CollabContext.Provider>
  );
}

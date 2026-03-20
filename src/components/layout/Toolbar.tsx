import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import ToolbarButton from '@/components/toolbar/ToolbarButton';
import LinkPopover from '@/components/toolbar/LinkPopover';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  Quote, List, ListOrdered, Minus,
  Undo2, Redo2, ChevronDown,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

const ICON = 15;

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const getCurrentStyle = (): string => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    return 'Paragraph';
  };

  return (
    <TooltipProvider delay={600}>
      {/* ── Inline BubbleMenu — appears on text selection ── */}
      <BubbleMenu
        editor={editor}
        className="tiptap-bubble-menu"
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
          shortcut="⌘B"
        >
          <Bold size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
          shortcut="⌘I"
        >
          <Italic size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
          shortcut="⌘U"
        >
          <Underline size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={ICON} />
        </ToolbarButton>

        <div className="w-px h-4 mx-0.5 shrink-0" style={{ backgroundColor: 'var(--border)' }} />

        <LinkPopover editor={editor} isActive={editor.isActive('link')} />
      </BubbleMenu>

      {/* ── Fixed toolbar — structural / document-level controls ── */}
      <div
        className="sticky z-40 flex items-center justify-center gap-0.5 px-3 h-[38px] overflow-x-auto shrink-0"
        style={{
          top: 52,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Style dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 gap-1 px-2"
                style={{ color: 'var(--text)' }}
              />
            }
          >
            {getCurrentStyle()}
            <ChevronDown size={11} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {[
              { label: 'Paragraph', action: () => editor.chain().focus().setParagraph().run() },
              { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
              { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
              { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
            ].map(({ label, action }) => (
              <DropdownMenuItem key={label} onClick={action} style={{ color: 'var(--text)' }}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="self-stretch mx-1" style={{ backgroundColor: 'var(--border)' }} />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align left"
        >
          <AlignLeft size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align center"
        >
          <AlignCenter size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align right"
        >
          <AlignRight size={ICON} />
        </ToolbarButton>

        <Separator orientation="vertical" className="self-stretch mx-1" style={{ backgroundColor: 'var(--border)' }} />

        {/* Block formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered list"
        >
          <ListOrdered size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={ICON} />
        </ToolbarButton>

        <Separator orientation="vertical" className="self-stretch mx-1" style={{ backgroundColor: 'var(--border)' }} />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
          shortcut="⌘Z"
        >
          <Undo2 size={ICON} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
          shortcut="⌘⇧Z"
        >
          <Redo2 size={ICON} />
        </ToolbarButton>

      </div>
    </TooltipProvider>
  );
}

import type { ReactNode } from 'react';

interface EditorAreaProps {
  children: ReactNode;
}

export default function EditorArea({ children }: EditorAreaProps) {
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-[740px] mx-auto py-12 px-4">
        {/* Page card */}
        <div
          className="rounded-xl"
          style={{
            backgroundColor: 'var(--surface)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.40)',
            padding: '72px 88px',
            minHeight: 900,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

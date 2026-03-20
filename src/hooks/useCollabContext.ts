import { createContext, useContext } from 'react';
import type * as Y from 'yjs';
import type { HocuspocusProvider } from '@hocuspocus/provider';
import type { ProviderStatus } from '@/hooks/useCollaboration';

interface CollabContextValue {
  ydoc: Y.Doc;
  provider: HocuspocusProvider | null;
  status: ProviderStatus;
  roomId: string;
}

export const CollabContext = createContext<CollabContextValue | null>(null);

export function useCollabContext(): CollabContextValue {
  const ctx = useContext(CollabContext);
  if (!ctx) {
    throw new Error('useCollabContext must be used within a CollabContext.Provider');
  }
  return ctx;
}

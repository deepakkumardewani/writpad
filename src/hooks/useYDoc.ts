import { useMemo } from 'react';
import * as Y from 'yjs';

const docCache = new Map<string, Y.Doc>();

export function useYDoc(roomId: string): { ydoc: Y.Doc } {
  const ydoc = useMemo(() => {
    const existing = docCache.get(roomId);
    if (existing) return existing;

    const doc = new Y.Doc();
    docCache.set(roomId, doc);
    return doc;
  }, [roomId]);

  return { ydoc };
}

import { useEffect, useState, useRef } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import type { WebSocketStatus } from "@hocuspocus/provider";
import * as Y from "yjs";
import { YDOC_ROOM_PREFIX } from "@/lib/constants";

export type ProviderStatus = `${WebSocketStatus}`;

interface UseCollaborationResult {
  provider: HocuspocusProvider | null;
  status: ProviderStatus;
  synced: boolean;
}

export type { UseCollaborationResult };

export function useCollaboration(
  ydoc: Y.Doc,
  roomId: string,
): UseCollaborationResult {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const [status, setStatus] = useState<ProviderStatus>("connecting");
  const [synced, setSynced] = useState(false);
  const providerRef = useRef<HocuspocusProvider | null>(null);

  useEffect(() => {
    const roomName = `${YDOC_ROOM_PREFIX}${roomId}`;

    const newProvider = new HocuspocusProvider({
      url: `ws://127.0.0.1:1234`,
      name: roomName,
      document: ydoc,
    });

    providerRef.current = newProvider;
    setProvider(newProvider);

    const statusHandler = ({
      status: newStatus,
    }: {
      status: WebSocketStatus;
    }) => {
      setStatus(newStatus);
    };

    newProvider.on("status", statusHandler);
    newProvider.on("synced", () => setSynced(true));

    return () => {
      newProvider.off("status", statusHandler);
      newProvider.destroy();
      providerRef.current = null;
      setProvider(null);
      setStatus("connecting");
      setSynced(false);
    };
  }, [ydoc, roomId]);

  return { provider, status, synced };
}

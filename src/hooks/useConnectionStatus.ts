import { useEffect } from 'react';
import type { ConnectionStatus } from '@/types/collab';
import type { ProviderStatus } from '@/hooks/useCollaboration';
import { useUIStore } from '@/store/uiStore';

interface UseConnectionStatusParams {
  providerStatus: ProviderStatus;
  saveDebounceActive: boolean;
}

export function useConnectionStatus({
  providerStatus,
  saveDebounceActive,
}: UseConnectionStatusParams): ConnectionStatus {
  const setConnectionStatus = useUIStore((s) => s.setConnectionStatus);
  const connectionStatus = useUIStore((s) => s.connectionStatus);

  useEffect(() => {
    let status: ConnectionStatus;

    if (saveDebounceActive) {
      status = 'saving';
    } else if (providerStatus === 'connected') {
      status = 'live';
    } else if (providerStatus === 'connecting') {
      status = 'local';
    } else {
      status = 'offline';
    }

    setConnectionStatus(status);
  }, [providerStatus, saveDebounceActive, setConnectionStatus]);

  return connectionStatus;
}

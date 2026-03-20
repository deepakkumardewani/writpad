import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import type { UserIdentity } from '@/types/user';

interface UseLocalUserResult {
  user: UserIdentity;
  isNameSet: boolean;
  setName: (name: string) => void;
  setColor: (color: string) => void;
}

export function useLocalUser(): UseLocalUserResult {
  const id = useUserStore((s) => s.id);
  const name = useUserStore((s) => s.name);
  const color = useUserStore((s) => s.color);
  const isNameSet = useUserStore((s) => s.isNameSet);
  const loadFromStorage = useUserStore((s) => s.loadFromStorage);
  const storeSetName = useUserStore((s) => s.setName);
  const storeSetColor = useUserStore((s) => s.setColor);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const setName = useCallback(
    (newName: string) => storeSetName(newName),
    [storeSetName],
  );

  const setColor = useCallback(
    (newColor: string) => storeSetColor(newColor),
    [storeSetColor],
  );

  return {
    user: { id, name, color },
    isNameSet,
    setName,
    setColor,
  };
}

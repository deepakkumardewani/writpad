import { create } from 'zustand';
import type { UserIdentity } from '@/types/user';
import { LOCAL_STORAGE_USER_KEY, USER_COLORS } from '@/lib/constants';
import { generateId } from '@/lib/nanoid';
import { safeGetItem, safeSetItem } from '@/lib/utils';

interface UserState extends UserIdentity {
  isNameSet: boolean;
  setName: (name: string) => void;
  setColor: (color: string) => void;
  setUser: (user: Partial<UserIdentity>) => void;
  loadFromStorage: () => void;
}

function persistUser(state: { id: string; name: string; color: string }): void {
  safeSetItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({
    id: state.id,
    name: state.name,
    color: state.color,
  }));
}

function getRandomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

export const useUserStore = create<UserState>((set, get) => ({
  id: generateId(10),
  name: '',
  color: getRandomColor(),
  isNameSet: false,

  setName: (name: string) => {
    set({ name, isNameSet: name.trim().length > 0 });
    const state = get();
    persistUser(state);
  },

  setColor: (color: string) => {
    set({ color });
    const state = get();
    persistUser(state);
  },

  setUser: (user: Partial<UserIdentity>) => {
    set(user);
    const state = get();
    persistUser(state);
  },

  loadFromStorage: () => {
    const raw = safeGetItem(LOCAL_STORAGE_USER_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<UserIdentity>;
      if (parsed.id && parsed.name && parsed.color) {
        set({
          id: parsed.id,
          name: parsed.name,
          color: parsed.color,
          isNameSet: parsed.name.trim().length > 0,
        });
      }
    } catch {
      console.warn('Failed to parse stored user identity');
    }
  },
}));

import { create } from 'zustand';
import type { ConnectionStatus } from '@/types/collab';

interface UIState {
  shareModalOpen: boolean;
  wordCount: number;
  charCount: number;
  connectionStatus: ConnectionStatus;
  sidebarOpen: boolean;
  lastSavedAt: number | null;
  toggleShareModal: () => void;
  setWordCount: (n: number) => void;
  setCharCount: (n: number) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  shareModalOpen: false,
  wordCount: 0,
  charCount: 0,
  connectionStatus: 'local',
  sidebarOpen: true,
  lastSavedAt: null,

  toggleShareModal: () => set((s) => ({ shareModalOpen: !s.shareModalOpen })),
  setWordCount: (n: number) => set({ wordCount: n }),
  setCharCount: (n: number) => set({ charCount: n }),
  setConnectionStatus: (status: ConnectionStatus) =>
    set((s) => ({
      connectionStatus: status,
      lastSavedAt: status === 'saved' ? Date.now() : s.lastSavedAt,
    })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));

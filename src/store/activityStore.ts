import { create } from 'zustand';
import type { ActivityEvent } from '@/types/activity';

const MAX_ACTIVITIES = 5;

interface ActivityState {
  activities: ActivityEvent[];
  addActivity: (event: ActivityEvent) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],

  addActivity: (event: ActivityEvent) =>
    set((s) => ({
      activities: [event, ...s.activities].slice(0, MAX_ACTIVITIES),
    })),

  clearActivities: () => set({ activities: [] }),
}));

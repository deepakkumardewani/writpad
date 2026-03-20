export type ActivityType =
  | 'joined'
  | 'edited'
  | 'commented'
  | 'exported'
  | 'left';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  userName: string;
  userColor: string;
  timestamp: number;
}

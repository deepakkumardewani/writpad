export interface UserIdentity {
  id: string;
  name: string;
  color: string;
}

export interface AwarenessUser {
  id: string;
  name: string;
  color: string;
}

export interface AwarenessState {
  clientId: number;
  user: AwarenessUser;
  cursor: {
    anchor: unknown | null;
    head: unknown | null;
  } | null;
  isTyping: boolean;
}

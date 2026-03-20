export type ConnectionStatus = 'live' | 'local' | 'saving' | 'saved' | 'offline';

export const STATUS_LABELS: Record<ConnectionStatus, string> = {
  live: 'Live',
  local: 'Local',
  saving: 'Saving\u2026',
  saved: 'Saved',
  offline: 'Offline',
};

export const STATUS_COLORS: Record<ConnectionStatus, string> = {
  live: '#4A8C42',
  local: '#8A8880',
  saving: '#D4872A',
  saved: '#4A8C42',
  offline: '#E05252',
};

export interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  accessToken: string;
  expiryTimestamp: string;
  maxDownloads: number;
  usedDownloads: number;
  status: 'active' | 'revoked';
  visibility: 'public' | 'private';
  uploadedBy: string;
  uploadedByName: string;
}

export interface ActivityEvent {
  id: string;
  fileId: string;
  timestamp: string;
  eventType: 'download_success' | 'download_blocked' | 'link_regenerated' | 'link_revoked' | 'access_attempt';
  status: 'success' | 'blocked' | 'info';
  details: string;
}

export interface AdminStats {
  totalUsers: number;
  totalFiles: number;
  activeLinks: number;
  expiredLinks: number;
  totalDownloads: number;
  blockedAttempts: number;
}

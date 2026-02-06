import React, { createContext, useContext, useState, useCallback } from 'react';
import { SharedFile, ActivityEvent } from './types';
import { mockFiles, mockActivity } from './mock-data';

interface FileContextType {
  files: SharedFile[];
  activity: ActivityEvent[];
  addFile: (file: SharedFile) => void;
  updateFile: (id: string, updates: Partial<SharedFile>) => void;
  revokeFile: (id: string) => void;
  regenerateToken: (id: string) => void;
  bulkRevoke: (ids: string[]) => void;
  addActivity: (event: ActivityEvent) => void;
}

const FileContext = createContext<FileContextType | null>(null);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<SharedFile[]>(mockFiles);
  const [activity, setActivity] = useState<ActivityEvent[]>(mockActivity);

  const addFile = useCallback((file: SharedFile) => {
    setFiles(prev => [file, ...prev]);
    setActivity(prev => [{
      id: Math.random().toString(36).substring(2),
      fileId: file.id,
      timestamp: new Date().toISOString(),
      eventType: 'access_attempt',
      status: 'info',
      details: `File "${file.name}" uploaded and link generated`,
    }, ...prev]);
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<SharedFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const revokeFile = useCallback((id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'revoked' as const } : f));
    setActivity(prev => [{
      id: Math.random().toString(36).substring(2),
      fileId: id,
      timestamp: new Date().toISOString(),
      eventType: 'link_revoked',
      status: 'blocked',
      details: 'Link revoked',
    }, ...prev]);
  }, []);

  const regenerateToken = useCallback((id: string) => {
    const newToken = 'tk_' + Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2)).join('');
    setFiles(prev => prev.map(f => f.id === id ? {
      ...f,
      accessToken: newToken,
      status: 'active' as const,
      expiryTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    } : f));
    setActivity(prev => [{
      id: Math.random().toString(36).substring(2),
      fileId: id,
      timestamp: new Date().toISOString(),
      eventType: 'link_regenerated',
      status: 'info',
      details: 'Access token regenerated',
    }, ...prev]);
  }, []);

  const bulkRevoke = useCallback((ids: string[]) => {
    setFiles(prev => prev.map(f => ids.includes(f.id) ? { ...f, status: 'revoked' as const } : f));
    const newEvents: ActivityEvent[] = ids.map(id => ({
      id: Math.random().toString(36).substring(2),
      fileId: id,
      timestamp: new Date().toISOString(),
      eventType: 'link_revoked' as const,
      status: 'blocked' as const,
      details: 'Link revoked by admin (bulk action)',
    }));
    setActivity(prev => [...newEvents, ...prev]);
  }, []);

  const addActivity = useCallback((event: ActivityEvent) => {
    setActivity(prev => [event, ...prev]);
  }, []);

  return (
    <FileContext.Provider value={{ files, activity, addFile, updateFile, revokeFile, regenerateToken, bulkRevoke, addActivity }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error('useFiles must be used within FileProvider');
  return ctx;
}

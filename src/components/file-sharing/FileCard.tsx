import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Link2, RefreshCw, Ban, Clock, Download, Eye, EyeOff, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SharedFile } from '@/lib/types';
import { formatFileSize, formatTimeAgo, getTimeRemaining, calculateRisk, getFileIcon } from '@/lib/mock-data';
import { useFiles } from '@/lib/file-context';
import RiskBadge from './RiskBadge';
import FileSettingsDialog from './FileSettingsDialog';
import { toast } from 'sonner';

interface FileCardProps {
  file: SharedFile;
  index: number;
}

export default function FileCard({ file, index }: FileCardProps) {
  const { revokeFile, regenerateToken } = useFiles();
  const [showSettings, setShowSettings] = useState(false);
  const risk = calculateRisk(file);
  const isExpired = new Date(file.expiryTimestamp).getTime() < Date.now();
  const isRevoked = file.status === 'revoked';
  const isActive = !isExpired && !isRevoked;
  const limitReached = file.maxDownloads > 0 && file.usedDownloads >= file.maxDownloads;

  const shareUrl = `${window.location.origin}/file/${file.id}?token=${file.accessToken}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className={`
          group rounded-xl border bg-card p-5 card-shadow transition-all duration-200 hover:card-shadow-hover
          ${!isActive ? 'opacity-70' : ''}
        `}
      >
        <div className="flex items-start gap-4">
          <div className="text-2xl flex-shrink-0 mt-0.5">{getFileIcon(file.type)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{file.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatFileSize(file.size)} · {formatTimeAgo(file.uploadedAt)}
                </p>
              </div>
              <RiskBadge level={risk} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isExpired ? (
                  <span className="text-destructive font-medium">Expired</span>
                ) : (
                  <span>{getTimeRemaining(file.expiryTimestamp)} left</span>
                )}
              </span>

              <span className="inline-flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {file.maxDownloads === 0 ? (
                  <span>{file.usedDownloads} downloads (unlimited)</span>
                ) : (
                  <span className={limitReached ? 'text-destructive font-medium' : ''}>
                    {file.usedDownloads} / {file.maxDownloads} downloads
                  </span>
                )}
              </span>

              <span className="inline-flex items-center gap-1">
                {file.visibility === 'public' ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Private</span>
                  </>
                )}
              </span>

              {isRevoked && (
                <span className="inline-flex items-center gap-1 text-destructive font-medium">
                  <Ban className="w-3.5 h-3.5" />
                  Revoked
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={copyLink}
                disabled={!isActive}
                className="text-xs"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => regenerateToken(file.id)}
                className="text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Regenerate
              </Button>
              {isActive && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => revokeFile(file.id)}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  <Ban className="w-3.5 h-3.5 mr-1.5" />
                  Revoke
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSettings(true)}
                className="text-xs ml-auto"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <FileSettingsDialog
        file={file}
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </>
  );
}

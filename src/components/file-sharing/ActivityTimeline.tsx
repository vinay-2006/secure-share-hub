import { motion } from 'framer-motion';
import { Download, Ban, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ActivityEvent } from '@/lib/types';
import { formatTime } from '@/lib/mock-data';

const eventConfig: Record<string, { icon: typeof Download; className: string }> = {
  download_success: { icon: Download, className: 'bg-success/10 text-success' },
  download_blocked: { icon: Ban, className: 'bg-destructive/10 text-destructive' },
  link_regenerated: { icon: RefreshCw, className: 'bg-primary/10 text-primary' },
  link_revoked: { icon: AlertTriangle, className: 'bg-warning/10 text-warning' },
  access_attempt: { icon: ShieldCheck, className: 'bg-primary/10 text-primary' },
};

interface ActivityTimelineProps {
  events: ActivityEvent[];
  showFileId?: boolean;
}

export default function ActivityTimeline({ events, showFileId = false }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.map((event, index) => {
        const config = eventConfig[event.eventType] || eventConfig.access_attempt;
        const Icon = config.icon;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className="flex items-start gap-3 py-3 px-4 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.className}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{event.details}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
                {showFileId && (
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                    {event.fileId}
                  </span>
                )}
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              event.status === 'success' ? 'bg-success/10 text-success' :
              event.status === 'blocked' ? 'bg-destructive/10 text-destructive' :
              'bg-primary/10 text-primary'
            }`}>
              {event.status}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

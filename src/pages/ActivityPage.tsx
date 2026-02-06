import { useMemo } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFiles } from '@/lib/file-context';
import ActivityTimeline from '@/components/file-sharing/ActivityTimeline';
import { exportToCSV } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function ActivityPage() {
  const { activity } = useFiles();

  const handleExport = () => {
    const data = activity.map(e => ({
      timestamp: new Date(e.timestamp).toISOString(),
      fileId: e.fileId,
      eventType: e.eventType,
      status: e.status,
      details: e.details,
    }));
    exportToCSV(data, `activity-log-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Activity log exported');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Activity</h1>
          <p className="text-muted-foreground mt-1">Track all file access and sharing events.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDown className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-xl border bg-card card-shadow">
        <ActivityTimeline events={activity} showFileId />
      </div>
    </div>
  );
}

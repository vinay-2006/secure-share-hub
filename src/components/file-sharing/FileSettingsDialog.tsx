import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SharedFile } from '@/lib/types';
import { useFiles } from '@/lib/file-context';
import { toast } from 'sonner';

interface FileSettingsDialogProps {
  file: SharedFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FileSettingsDialog({ file, open, onOpenChange }: FileSettingsDialogProps) {
  const { updateFile } = useFiles();
  const [visibility, setVisibility] = useState(file.visibility);
  const [maxDownloads, setMaxDownloads] = useState(file.maxDownloads.toString());
  const [expiryHours, setExpiryHours] = useState('24');

  const handleSave = () => {
    const newExpiry = new Date(Date.now() + parseInt(expiryHours) * 60 * 60 * 1000).toISOString();
    updateFile(file.id, {
      visibility,
      maxDownloads: parseInt(maxDownloads) || 0,
      expiryTimestamp: newExpiry,
    });
    toast.success('File settings updated');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>File Settings</DialogTitle>
          <DialogDescription className="truncate">{file.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Public Access</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Anyone with the link can download
              </p>
            </div>
            <Switch
              checked={visibility === 'public'}
              onCheckedChange={(checked) => setVisibility(checked ? 'public' : 'private')}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Expiry Duration</Label>
            <Select value={expiryHours} onValueChange={setExpiryHours}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="72">72 hours</SelectItem>
                <SelectItem value="168">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Downloads</Label>
            <p className="text-xs text-muted-foreground">Set to 0 for unlimited</p>
            <Input
              type="number"
              min="0"
              value={maxDownloads}
              onChange={(e) => setMaxDownloads(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

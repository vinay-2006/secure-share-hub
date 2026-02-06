import { useCallback, useState, useRef } from 'react';
import { Upload, FileUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useFiles } from '@/lib/file-context';
import { formatFileSize } from '@/lib/mock-data';
import { toast } from 'sonner';

export default function FileUpload() {
  const { addFile } = useFiles();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleUpload = useCallback(() => {
    if (!selectedFile) return;
    const fileId = Math.random().toString(36).substring(2, 10);
    const token = 'tk_' + Array.from({ length: 32 }, () => Math.random().toString(36).charAt(2)).join('');

    addFile({
      id: fileId,
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      accessToken: token,
      expiryTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      maxDownloads: 5,
      usedDownloads: 0,
      status: 'active',
      visibility: 'private',
      uploadedBy: 'user-1',
      uploadedByName: 'Alex Chen',
    });

    toast.success('File uploaded successfully', {
      description: `${selectedFile.name} is ready to share.`,
    });
    setSelectedFile(null);
  }, [selectedFile, addFile]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/40 hover:bg-accent/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <motion.div
          animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3"
        >
          <Upload className="w-6 h-6 text-primary" />
        </motion.div>
        <p className="text-sm font-medium text-foreground">
          Drop a file here or <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Any file type up to 100MB
        </p>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border card-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button onClick={handleUpload} size="sm">
                Upload & Share
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

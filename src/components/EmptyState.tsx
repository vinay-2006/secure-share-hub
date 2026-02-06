import { FileIcon, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No files yet",
  description = "Upload your first file to get started",
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="rounded-full bg-muted p-6">
        {icon || <FolderOpen className="h-12 w-12 text-muted-foreground" />}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
      {action && <div className="pt-4">{action}</div>}
    </div>
  );
}

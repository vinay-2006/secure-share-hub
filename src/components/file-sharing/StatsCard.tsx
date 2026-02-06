import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

const variantClasses: Record<string, string> = {
  default: 'bg-card text-card-foreground',
  primary: 'bg-primary/5 text-card-foreground border-primary/15',
  success: 'bg-success/5 text-card-foreground border-success/15',
  warning: 'bg-warning/5 text-card-foreground border-warning/15',
  destructive: 'bg-destructive/5 text-card-foreground border-destructive/15',
};

const iconVariantClasses: Record<string, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

export default function StatsCard({ title, value, icon: Icon, description, variant = 'default' }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-xl border p-5 card-shadow transition-shadow hover:card-shadow-hover ${variantClasses[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value.toLocaleString()}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconVariantClasses[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

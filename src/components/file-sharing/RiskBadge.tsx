import { RiskLevel } from '@/lib/mock-data';

const config: Record<RiskLevel, { label: string; emoji: string; className: string }> = {
  low: { label: 'Low Risk', emoji: '🔵', className: 'bg-primary/10 text-primary border-primary/20' },
  medium: { label: 'Medium Risk', emoji: '🟡', className: 'bg-warning/10 text-warning border-warning/20' },
  high: { label: 'High Risk', emoji: '🔴', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.className}`}>
      <span>{c.emoji}</span>
      {c.label}
    </span>
  );
}

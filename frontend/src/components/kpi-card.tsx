import { cn } from '@/lib/utils';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Record<Tone, { wrap: string; label: string; value: string }> = {
  primary: { wrap: 'border-primary/20 bg-primary/5', label: 'text-primary', value: 'text-primary' },
  success: { wrap: 'border-emerald-200 bg-emerald-50', label: 'text-emerald-700', value: 'text-emerald-700' },
  warning: { wrap: 'border-amber-200 bg-amber-50', label: 'text-amber-700', value: 'text-amber-700' },
  danger: { wrap: 'border-rose-200 bg-rose-50', label: 'text-rose-700', value: 'text-rose-700' },
  neutral: { wrap: 'border-border bg-card', label: 'text-muted-foreground', value: 'text-foreground' },
};

type Props = { label: string; value: string; hint?: string; tone?: Tone; icon?: React.ReactNode };

// Carte indicateur reprenant la disposition du redesign (libellé en capitales,
// grande valeur colorée, sous-texte), en thème clair MTN.
export function KpiCard({ label, value, hint, tone = 'primary', icon }: Props) {
  const t = TONES[tone];
  return (
    <div className={cn('rounded-xl border p-5', t.wrap)}>
      <div className="flex items-center justify-between">
        <p className={cn('text-xs font-semibold uppercase tracking-wider', t.label)}>{label}</p>
        {icon && <span className={t.label}>{icon}</span>}
      </div>
      <p className={cn('mt-2 text-2xl font-bold', t.value)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

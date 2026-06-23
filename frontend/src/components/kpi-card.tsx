import { cn } from '@/lib/utils';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Record<Tone, { dot: string; value: string }> = {
  primary: { dot: 'bg-primary', value: 'text-primary' },
  success: { dot: 'bg-emerald-600', value: 'text-emerald-700' },
  warning: { dot: 'bg-amber-500', value: 'text-amber-700' },
  danger: { dot: 'bg-rose-500', value: 'text-rose-700' },
  neutral: { dot: 'bg-muted-foreground', value: 'text-foreground' },
};

type Props = { label: string; value: string; hint?: string; tone?: Tone; icon?: React.ReactNode };

// Carte indicateur reprenant la disposition du redesign (libellé en capitales,
// grande valeur, sous-texte) en thème clair sobre : fond neutre, seule la
// valeur et une petite pastille portent la couleur.
export function KpiCard({ label, value, hint, tone = 'primary', icon }: Props) {
  const t = TONES[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className={cn('h-2 w-2 rounded-full', t.dot)} />
          {label}
        </p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className={cn('mt-2 text-2xl font-bold', t.value)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

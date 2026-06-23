import { cn } from '@/lib/utils';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const DOTS: Record<Tone, string> = {
  primary: 'bg-primary',
  success: 'bg-emerald-600',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-muted-foreground',
};

type Props = { label: string; value: string; hint?: string; tone?: Tone; icon?: React.ReactNode };

// Carte indicateur reprenant la disposition du redesign (libellé en capitales,
// grande valeur, sous-texte) en thème clair très sobre : fond neutre, valeur en
// gris foncé, seule une petite pastille porte la couleur du ton.
export function KpiCard({ label, value, hint, tone = 'primary', icon }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className={cn('h-2 w-2 rounded-full', DOTS[tone])} />
          {label}
        </p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { cn } from '@/lib/utils';

export type SelectOption = { value: string; label: string; hint?: string };

// Variante auto-gérée : pratique pour les selects de formulaire (création ou
// édition) qui n'ont pas besoin de remonter leur valeur au parent.
export function SearchableSelectField({
  options,
  defaultValue = '',
  placeholder,
  className,
}: {
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return <SearchableSelect options={options} value={value} onChange={setValue} placeholder={placeholder} className={className} />;
}

type Props = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

// Liste déroulante avec recherche intégrée, sans dépendance externe. Permet de
// retrouver rapidement un patient, une prestation ou un médecin en saisissant
// quelques lettres, tout en gardant la liste visible.
export function SearchableSelect({ options, value, onChange, placeholder = 'Sélectionner...', className }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const q = query.toLowerCase();
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q) || (o.hint ?? '').toLowerCase().includes(q));

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className={cn('truncate', !selected && 'text-muted-foreground')}>{selected ? selected.label : placeholder}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 && <p className="px-3 py-4 text-center text-xs text-muted-foreground">Aucun résultat</p>}
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); setQuery(''); }}
                className={cn('flex w-full items-center justify-between gap-2 rounded px-2 py-2 text-left text-sm hover:bg-muted', o.value === value && 'bg-muted')}
              >
                <span className="truncate">
                  {o.label}
                  {o.hint && <span className="ml-1.5 text-xs text-muted-foreground">{o.hint}</span>}
                </span>
                {o.value === value && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

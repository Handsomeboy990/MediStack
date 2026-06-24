'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning';

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastInput = {
  title: string;
  description?: string;
  type?: ToastType;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function iconFor(type: ToastType) {
  if (type === 'success') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (type === 'warning') return <TriangleAlert className="h-4 w-4 text-amber-600" />;
  return <Info className="h-4 w-4 text-primary" />;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const entry: ToastItem = {
      id,
      title: input.title,
      description: input.description,
      type: input.type ?? 'success',
    };
    setItems((prev) => [entry, ...prev].slice(0, 4));
    window.setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="pointer-events-auto rounded-xl border border-border bg-white p-3 shadow-lg">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{iconFor(item.type)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                {item.description ? <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

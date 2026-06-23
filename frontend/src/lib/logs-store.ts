'use client';

import { useSyncExternalStore } from 'react';

export type LogAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type LogEntry = {
  id: string;
  date: string; // ISO
  user: string;
  action: LogAction;
  entity: string;
  description: string;
};

// Journal d'audit applicatif. Toutes les actions (création, modification,
// suppression) y sont enregistrées. Les modifications et suppressions sont
// remontées en notification à l'administrateur.
let logs: LogEntry[] = [
  { id: 'LOG-seed-3', date: '2026-06-23T08:12:00', user: 'Lawson M.', action: 'UPDATE', entity: 'Utilisateur', description: 'Rôle de Dossou Roland modifié en Responsable de caisse' },
  { id: 'LOG-seed-2', date: '2026-06-23T08:05:00', user: 'Hodonou F.', action: 'CREATE', entity: 'Mouvement stock', description: 'Entrée de 50 Paracétamol 500 mg' },
  { id: 'LOG-seed-1', date: '2026-06-22T16:40:00', user: 'Gbaguidi A.', action: 'DELETE', entity: 'Prestation', description: 'Prestation obsolète supprimée du catalogue' },
];

const listeners = new Set<() => void>();
const emit = () => { for (const l of listeners) l(); };

let counter = 0;
export function log(action: LogAction, entity: string, description: string, user = 'Système') {
  counter += 1;
  logs = [{ id: `LOG-${Date.now()}-${counter}`, date: new Date().toISOString(), user, action, entity, description }, ...logs];
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useLogs() {
  return useSyncExternalStore(subscribe, () => logs, () => logs);
}

// Notifications destinées à l'administrateur : modifications et suppressions.
export function useNotificationsAdmin() {
  return useLogs().filter((l) => l.action === 'UPDATE' || l.action === 'DELETE');
}

'use client';

import { useSyncExternalStore } from 'react';

import { MAGASINS, type Magasin } from './mock-data';
import { log } from './logs-store';

// Magasin client pour les magasins et pharmacies. La création et la suppression
// sont conservées pour la durée de la session. Le magasin central est protégé.
let magasins: Magasin[] = [...MAGASINS];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function addMagasin(m: Omit<Magasin, 'id' | 'central'>) {
  const prefix = m.type === 'PHARMACIE' ? 'PHA' : 'MAG';
  const id = `${prefix}-${String(magasins.length + 1).padStart(3, '0')}`;
  magasins = [...magasins, { ...m, id, central: false }];
  emit();
  log('CREATE', 'Magasin', `${m.type === 'PHARMACIE' ? 'Pharmacie' : 'Magasin'} ${m.nom} créé`);
}

export function removeMagasin(id: string) {
  const m = magasins.find((x) => x.id === id && !x.central);
  magasins = magasins.filter((x) => x.id !== id || x.central);
  emit();
  if (m) log('DELETE', 'Magasin', `${m.type === 'PHARMACIE' ? 'Pharmacie' : 'Magasin'} ${m.nom} supprimé`);
}

export function useMagasins() {
  return useSyncExternalStore(subscribe, () => magasins, () => magasins);
}

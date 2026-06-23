'use client';

import { useSyncExternalStore } from 'react';

import { MAGASINS, type Magasin } from './mock-data';

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
}

export function removeMagasin(id: string) {
  magasins = magasins.filter((m) => m.id !== id || m.central);
  emit();
}

export function useMagasins() {
  return useSyncExternalStore(subscribe, () => magasins, () => magasins);
}

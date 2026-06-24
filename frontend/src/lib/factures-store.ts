'use client';

import { useSyncExternalStore } from 'react';

import { FACTURES, fmt, type Facture } from './mock-data';
import { log } from './logs-store';

const INITIAL_FACTURES: Facture[] = [...FACTURES];
let factures: Facture[] = [...INITIAL_FACTURES];
const listeners = new Set<() => void>();
const emit = () => { for (const l of listeners) l(); };

export function nextFactureId(date: string) {
  const compact = date.replaceAll('-', '');
  const sameDay = factures.filter((f) => f.date === date).length;
  return `FAC-${compact}-${String(sameDay + 1).padStart(3, '0')}`;
}

export function addFacture(f: Facture) {
  factures = [f, ...factures];
  emit();
  log('CREATE', 'Facture', `Facture ${f.id} créée pour ${f.patient} (${fmt(f.net)})`, f.agent);
}

export function setFactures(next: Facture[], user = 'Système') {
  factures = [...next];
  emit();
  log('UPDATE', 'Facture', `Jeu de données factures remplacé (${factures.length} entrées)`, user);
}

export function resetFactures(user = 'Système') {
  factures = [...INITIAL_FACTURES];
  emit();
  log('UPDATE', 'Facture', 'Jeu de données factures réinitialisé', user);
}

export function getFacturesSnapshot() {
  return factures;
}

export function updateFacture(id: string, patch: Partial<Facture>, user = 'Système') {
  factures = factures.map((f) => (f.id === id ? { ...f, ...patch } : f));
  emit();
  log('UPDATE', 'Facture', `Facture ${id} modifiée`, user);
}

export function useFactures() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => factures,
    () => factures,
  );
}

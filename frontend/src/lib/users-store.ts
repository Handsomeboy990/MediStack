'use client';

import { useSyncExternalStore } from 'react';

import { UTILISATEURS, type Utilisateur } from './mock-data';
import { log } from './logs-store';

const INITIAL_USERS: Utilisateur[] = [...UTILISATEURS];
let users: Utilisateur[] = [...INITIAL_USERS];
const listeners = new Set<() => void>();
const emit = () => { for (const l of listeners) l(); };

export function addUtilisateur(u: Omit<Utilisateur, 'id' | 'creeLe'>) {
  const id = `U-${String(users.length + 1).padStart(3, '0')}`;
  users = [{ ...u, id, creeLe: new Date().toISOString().slice(0, 10) }, ...users];
  emit();
  log('CREATE', 'Utilisateur', `Compte ${u.prenom} ${u.nom} (${u.role}) créé`);
}

export function setUtilisateurs(next: Utilisateur[], user = 'Système') {
  users = [...next];
  emit();
  log('UPDATE', 'Utilisateur', `Jeu de données utilisateurs remplacé (${users.length} entrées)`, user);
}

export function resetUtilisateurs(user = 'Système') {
  users = [...INITIAL_USERS];
  emit();
  log('UPDATE', 'Utilisateur', 'Jeu de données utilisateurs réinitialisé', user);
}

export function getUtilisateursSnapshot() {
  return users;
}

export function updateUtilisateur(id: string, patch: Partial<Utilisateur>) {
  const before = users.find((u) => u.id === id);
  users = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  const u = users.find((x) => x.id === id);
  emit();
  if (!u) return;
  const roleChange = before && patch.role && patch.role !== before.role ? ` (rôle : ${before.role} → ${patch.role})` : '';
  log('UPDATE', 'Utilisateur', `Compte ${u.prenom} ${u.nom} modifié${roleChange}`);
}

export function toggleActif(id: string) {
  const u = users.find((x) => x.id === id);
  if (!u) return;
  users = users.map((x) => (x.id === id ? { ...x, actif: !x.actif } : x));
  emit();
  log('UPDATE', 'Utilisateur', `Compte ${u.prenom} ${u.nom} ${u.actif ? 'désactivé' : 'activé'}`);
}

export function useUtilisateurs() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => users,
    () => users,
  );
}

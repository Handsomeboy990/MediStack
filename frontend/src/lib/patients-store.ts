'use client';

import { useSyncExternalStore } from 'react';

import { PATIENTS, type CarteAssurance, type Patient } from './mock-data';
import { log } from './logs-store';

// Magasin client minimal pour les patients. Les ajouts (patient, carte
// d'assurance) sont conservés pour la durée de la session, ce qui permet de
// démontrer l'enregistrement sans backend. La source initiale reste les
// données mock.
const INITIAL_PATIENTS: Patient[] = [...PATIENTS];
let patients: Patient[] = [...INITIAL_PATIENTS];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return patients;
}

export function addPatient(patient: Patient) {
  patients = [patient, ...patients];
  emit();
  log('CREATE', 'Patient', `Patient ${patient.prenom} ${patient.nom} (${patient.id}) créé`);
}

export function setPatients(next: Patient[], user = 'Système') {
  patients = [...next];
  emit();
  log('UPDATE', 'Patient', `Jeu de données patients remplacé (${patients.length} entrées)`, user);
}

export function resetPatients(user = 'Système') {
  patients = [...INITIAL_PATIENTS];
  emit();
  log('UPDATE', 'Patient', 'Jeu de données patients réinitialisé', user);
}

export function getPatientsSnapshot() {
  return patients;
}

export function addCarteAssurance(patientId: string, carte: CarteAssurance) {
  patients = patients.map((p) =>
    p.id === patientId ? { ...p, cartesAssurance: [...p.cartesAssurance, carte] } : p,
  );
  emit();
  const p = patients.find((x) => x.id === patientId);
  log('UPDATE', 'Patient', `Carte d'assurance ${carte.nom} ajoutée à ${p ? `${p.prenom} ${p.nom}` : patientId}`);
}

export function updatePatient(id: string, patch: Partial<Patient>) {
  patients = patients.map((p) => (p.id === id ? { ...p, ...patch } : p));
  emit();
  const p = patients.find((x) => x.id === id);
  log('UPDATE', 'Patient', `Informations de ${p ? `${p.prenom} ${p.nom}` : id} modifiées`);
}

export function nextPatientId() {
  return `PAT-${String(patients.length + 1).padStart(3, '0')}`;
}

export function usePatients() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function usePatient(id: string) {
  return usePatients().find((p) => p.id === id);
}

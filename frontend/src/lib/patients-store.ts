'use client';

import { useSyncExternalStore } from 'react';

import { PATIENTS, type CarteAssurance, type Patient } from './mock-data';

// Magasin client minimal pour les patients. Les ajouts (patient, carte
// d'assurance) sont conservés pour la durée de la session, ce qui permet de
// démontrer l'enregistrement sans backend. La source initiale reste les
// données mock.
let patients: Patient[] = [...PATIENTS];
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
}

export function addCarteAssurance(patientId: string, carte: CarteAssurance) {
  patients = patients.map((p) =>
    p.id === patientId ? { ...p, cartesAssurance: [...p.cartesAssurance, carte] } : p,
  );
  emit();
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

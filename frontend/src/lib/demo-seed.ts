'use client';

import { generateFactures, generateLogs, generatePatients, generateUtilisateurs } from './demo-data';
import { getFacturesSnapshot, setFactures, resetFactures } from './factures-store';
import { getPatientsSnapshot, setPatients, resetPatients } from './patients-store';
import { getUtilisateursSnapshot, setUtilisateurs, resetUtilisateurs } from './users-store';
import { setLogs, resetLogs, log } from './logs-store';

export type DemoPreset = 'small' | 'medium' | 'large';

const PRESETS: Record<DemoPreset, { patients: number; factures: number; users: number; logs: number }> = {
  small: { patients: 80, factures: 240, users: 35, logs: 180 },
  medium: { patients: 220, factures: 900, users: 90, logs: 600 },
  large: { patients: 600, factures: 3200, users: 180, logs: 1500 },
};

export function seedDemoData(preset: DemoPreset) {
  const target = PRESETS[preset];
  const patients = generatePatients(target.patients);
  const factures = generateFactures(target.factures, patients);
  const users = generateUtilisateurs(target.users);
  const logs = generateLogs(target.logs);

  setPatients(patients, 'Admin démo');
  setFactures(factures, 'Admin démo');
  setUtilisateurs(users, 'Admin démo');
  setLogs(logs);
  log('UPDATE', 'Système', `Dataset de démonstration chargé (${preset})`, 'Admin démo');

  return {
    patients: patients.length,
    factures: factures.length,
    users: users.length,
    logs: logs.length,
  };
}

export function resetDemoData() {
  resetPatients('Admin démo');
  resetFactures('Admin démo');
  resetUtilisateurs('Admin démo');
  resetLogs();
  log('UPDATE', 'Système', 'Dataset de démonstration réinitialisé', 'Admin démo');
}

export function ensureRichDemoData() {
  if (typeof window === 'undefined') return;

  const markerKey = 'meditrace-demo-autoseed';
  const alreadySeeded = window.localStorage.getItem(markerKey) === 'large';

  const patientCount = getPatientsSnapshot().length;
  const factureCount = getFacturesSnapshot().length;
  const userCount = getUtilisateursSnapshot().length;
  const insufficient = patientCount < 200 || factureCount < 800 || userCount < 80;

  if (!alreadySeeded || insufficient) {
    seedDemoData('large');
    window.localStorage.setItem(markerKey, 'large');
  }
}

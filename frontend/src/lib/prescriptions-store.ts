'use client';

import { useSyncExternalStore } from 'react';

import { addFacture, nextFactureId } from './factures-store';
import { MEDECINS, fmt, type Facture, type Patient } from './mock-data';
import { log } from './logs-store';

export type PrescriptionCategorie = 'ACTE' | 'BILAN';

export type PrescriptionCatalogueItem = {
  id: string;
  code: string;
  libelle: string;
  categorie: PrescriptionCategorie;
  tarif: number;
};

export type PrescriptionLigne = {
  code: string;
  libelle: string;
  categorie: PrescriptionCategorie;
  qte: number;
  pu: number;
};

export type Prescription = {
  id: string;
  patientId: string;
  patient: string;
  medecinId: string;
  medecin: string;
  date: string;
  lignes: PrescriptionLigne[];
  factureId: string;
};

const BILANS: PrescriptionCatalogueItem[] = [
  { id: 'B-001', code: 'BIO-NFS', libelle: 'NFS (Numération formule sanguine)', categorie: 'BILAN', tarif: 4500 },
  { id: 'B-002', code: 'BIO-GLY', libelle: 'Bilan glycémique complet', categorie: 'BILAN', tarif: 3500 },
  { id: 'B-003', code: 'BIO-CRP', libelle: 'CRP quantitative', categorie: 'BILAN', tarif: 4000 },
  { id: 'B-004', code: 'BIO-HEPA', libelle: 'Bilan hépatique', categorie: 'BILAN', tarif: 6500 },
  { id: 'B-005', code: 'BIO-REIN', libelle: 'Bilan rénal', categorie: 'BILAN', tarif: 6000 },
];

const ACTES: PrescriptionCatalogueItem[] = [
  { id: 'A-001', code: 'ACT-CONS', libelle: 'Consultation spécialisée', categorie: 'ACTE', tarif: 7000 },
  { id: 'A-002', code: 'ACT-PAN', libelle: 'Pansement complexe', categorie: 'ACTE', tarif: 3000 },
  { id: 'A-003', code: 'ACT-ECO', libelle: 'Échographie abdominale', categorie: 'ACTE', tarif: 12000 },
  { id: 'A-004', code: 'ACT-ECG', libelle: 'Électrocardiogramme', categorie: 'ACTE', tarif: 3000 },
  { id: 'A-005', code: 'ACT-INJ', libelle: 'Injection IM/IV', categorie: 'ACTE', tarif: 1500 },
];

export const PRESCRIPTION_CATALOGUE: PrescriptionCatalogueItem[] = [...ACTES, ...BILANS];

let prescriptions: Prescription[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function snapshot() {
  return prescriptions;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function nextPrescriptionId(date: string) {
  const compact = date.replaceAll('-', '');
  const sameDay = prescriptions.filter((p) => p.date === date).length;
  return `ORD-${compact}-${String(sameDay + 1).padStart(3, '0')}`;
}

type CreatePrescriptionInput = {
  patient: Pick<Patient, 'id' | 'nom' | 'prenom'>;
  medecinId: string;
  lignes: PrescriptionLigne[];
  date?: string;
};

export function createPrescriptionAndDraftFacture(input: CreatePrescriptionInput) {
  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const medecin = MEDECINS.find((m) => m.id === input.medecinId);
  const medecinLabel = medecin ? `Dr ${medecin.prenom} ${medecin.nom}` : 'Médecin';

  const montantBrut = input.lignes.reduce((sum, l) => sum + l.qte * l.pu, 0);
  const factureId = nextFactureId(date);
  const prescriptionId = nextPrescriptionId(date);

  const factureDraft: Facture = {
    id: factureId,
    patientId: input.patient.id,
    patient: `${input.patient.prenom} ${input.patient.nom}`,
    date,
    montantBrut,
    assurancePrise: 0,
    net: montantBrut,
    verse: 0,
    statut: 'EN_ATTENTE',
    agent: medecinLabel,
    modePaiement: null,
    lignes: input.lignes.map((l) => ({ libelle: l.libelle, qte: l.qte, pu: l.pu })),
    origine: 'PRESCRIPTION',
    prescriptionId,
    estBrouillon: true,
  };

  const prescription: Prescription = {
    id: prescriptionId,
    patientId: input.patient.id,
    patient: `${input.patient.prenom} ${input.patient.nom}`,
    medecinId: input.medecinId,
    medecin: medecinLabel,
    date,
    lignes: input.lignes,
    factureId,
  };

  prescriptions = [prescription, ...prescriptions];
  addFacture(factureDraft);
  emit();
  log('CREATE', 'Prescription', `Prescription ${prescriptionId} créée pour ${prescription.patient}; brouillon ${factureId} envoyé en caisse`, medecinLabel);

  return { prescription, facture: factureDraft };
}

export function usePrescriptions() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function formatPrescriptionTotal(lines: PrescriptionLigne[]) {
  const total = lines.reduce((sum, l) => sum + l.qte * l.pu, 0);
  return fmt(total);
}

export function getCatalogByCategorie(categorie: PrescriptionCategorie): PrescriptionCatalogueItem[] {
  return PRESCRIPTION_CATALOGUE.filter((item) => item.categorie === categorie);
}

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
  { id: 'B-006', code: 'BIO-IONO', libelle: 'Ionogramme sanguin', categorie: 'BILAN', tarif: 5000 },
  { id: 'B-007', code: 'BIO-UREE', libelle: 'Urée sanguine', categorie: 'BILAN', tarif: 3000 },
  { id: 'B-008', code: 'BIO-CREA', libelle: 'Créatininémie', categorie: 'BILAN', tarif: 3200 },
  { id: 'B-009', code: 'BIO-TRANS', libelle: 'Transaminases ASAT/ALAT', categorie: 'BILAN', tarif: 5200 },
  { id: 'B-010', code: 'BIO-BILI', libelle: 'Bilirubine totale et conjuguée', categorie: 'BILAN', tarif: 4500 },
  { id: 'B-011', code: 'BIO-LIPID', libelle: 'Bilan lipidique complet', categorie: 'BILAN', tarif: 7500 },
  { id: 'B-012', code: 'BIO-HBA1C', libelle: 'Hémoglobine glyquée (HbA1c)', categorie: 'BILAN', tarif: 7000 },
  { id: 'B-013', code: 'BIO-TSH', libelle: 'TSH ultra sensible', categorie: 'BILAN', tarif: 8000 },
  { id: 'B-014', code: 'BIO-FERR', libelle: 'Ferritine', categorie: 'BILAN', tarif: 6500 },
  { id: 'B-015', code: 'BIO-VITB12', libelle: 'Dosage vitamine B12', categorie: 'BILAN', tarif: 7800 },
  { id: 'B-016', code: 'BIO-PTINR', libelle: 'TP / INR', categorie: 'BILAN', tarif: 4200 },
  { id: 'B-017', code: 'BIO-TCA', libelle: 'Temps de céphaline activée', categorie: 'BILAN', tarif: 4200 },
  { id: 'B-018', code: 'BIO-VS', libelle: 'Vitesse de sédimentation', categorie: 'BILAN', tarif: 2800 },
  { id: 'B-019', code: 'BIO-HB', libelle: 'Hémoglobine isolée', categorie: 'BILAN', tarif: 2500 },
  { id: 'B-020', code: 'BIO-GS', libelle: 'Groupage sanguin ABO/Rh', categorie: 'BILAN', tarif: 3500 },
  { id: 'B-021', code: 'BIO-URIC', libelle: 'Acide urique', categorie: 'BILAN', tarif: 3200 },
  { id: 'B-022', code: 'BIO-AMYL', libelle: 'Amylase / Lipase', categorie: 'BILAN', tarif: 6000 },
  { id: 'B-023', code: 'BIO-CALPH', libelle: 'Calcium / Phosphore', categorie: 'BILAN', tarif: 5200 },
  { id: 'B-024', code: 'BIO-MAG', libelle: 'Magnésémie', categorie: 'BILAN', tarif: 3800 },
  { id: 'B-025', code: 'BIO-PROTC', libelle: 'Protéine C réactive ultrasensible', categorie: 'BILAN', tarif: 5600 },
];

const ACTES: PrescriptionCatalogueItem[] = [
  { id: 'A-001', code: 'ACT-CONS', libelle: 'Consultation spécialisée', categorie: 'ACTE', tarif: 7000 },
  { id: 'A-002', code: 'ACT-PAN', libelle: 'Pansement complexe', categorie: 'ACTE', tarif: 3000 },
  { id: 'A-003', code: 'ACT-ECO', libelle: 'Échographie abdominale', categorie: 'ACTE', tarif: 12000 },
  { id: 'A-004', code: 'ACT-ECG', libelle: 'Électrocardiogramme', categorie: 'ACTE', tarif: 3000 },
  { id: 'A-005', code: 'ACT-INJ', libelle: 'Injection IM/IV', categorie: 'ACTE', tarif: 1500 },
  { id: 'A-006', code: 'ACT-RXTHO', libelle: 'Radiographie thoracique', categorie: 'ACTE', tarif: 10000 },
  { id: 'A-007', code: 'ACT-RXMEM', libelle: 'Radiographie membre', categorie: 'ACTE', tarif: 9000 },
  { id: 'A-008', code: 'ACT-ECHOPELV', libelle: 'Échographie pelvienne', categorie: 'ACTE', tarif: 11500 },
  { id: 'A-009', code: 'ACT-ECHOBS', libelle: 'Échographie obstétricale', categorie: 'ACTE', tarif: 14000 },
  { id: 'A-010', code: 'ACT-ECHOCAR', libelle: 'Échocardiographie', categorie: 'ACTE', tarif: 18000 },
  { id: 'A-011', code: 'ACT-DOPVEIN', libelle: 'Doppler veineux', categorie: 'ACTE', tarif: 20000 },
  { id: 'A-012', code: 'ACT-DOPART', libelle: 'Doppler artériel', categorie: 'ACTE', tarif: 21000 },
  { id: 'A-013', code: 'ACT-NEBUL', libelle: 'Nébulisation thérapeutique', categorie: 'ACTE', tarif: 2500 },
  { id: 'A-014', code: 'ACT-SUTURE', libelle: 'Suture simple', categorie: 'ACTE', tarif: 5500 },
  { id: 'A-015', code: 'ACT-SUTCOM', libelle: 'Suture complexe', categorie: 'ACTE', tarif: 9000 },
  { id: 'A-016', code: 'ACT-PLATRE', libelle: 'Pose de plâtre', categorie: 'ACTE', tarif: 12000 },
  { id: 'A-017', code: 'ACT-RETRAITP', libelle: 'Retrait de plâtre', categorie: 'ACTE', tarif: 4500 },
  { id: 'A-018', code: 'ACT-KINE', libelle: 'Séance de kinésithérapie', categorie: 'ACTE', tarif: 5000 },
  { id: 'A-019', code: 'ACT-ECBU', libelle: 'Prélèvement ECBU', categorie: 'ACTE', tarif: 2500 },
  { id: 'A-020', code: 'ACT-PDS', libelle: 'Prélèvement sanguin', categorie: 'ACTE', tarif: 1500 },
  { id: 'A-021', code: 'ACT-PERF', libelle: 'Pose de perfusion', categorie: 'ACTE', tarif: 2800 },
  { id: 'A-022', code: 'ACT-SONDE', libelle: 'Pose de sonde urinaire', categorie: 'ACTE', tarif: 4200 },
  { id: 'A-023', code: 'ACT-ASP', libelle: 'Aspiration bronchique', categorie: 'ACTE', tarif: 4000 },
  { id: 'A-024', code: 'ACT-OXY', libelle: 'Oxygénothérapie (séance)', categorie: 'ACTE', tarif: 3500 },
  { id: 'A-025', code: 'ACT-CNTL', libelle: 'Consultation de contrôle', categorie: 'ACTE', tarif: 5000 },
  { id: 'A-026', code: 'ACT-SAT', libelle: 'Mesure de saturation en oxygène', categorie: 'ACTE', tarif: 1800 },
  { id: 'A-027', code: 'ACT-TENS', libelle: 'Contrôle tensionnel', categorie: 'ACTE', tarif: 1500 },
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

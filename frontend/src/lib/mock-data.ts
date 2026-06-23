// ─── Patients ───────────────────────────────────────────────
export type Patient = {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  adresse: string;
  assurance: string | null;
  numeroAssurance: string | null;
  tauxCouverture: number;
  urgenceNom: string;
  urgenceTel: string;
};

export const PATIENTS: Patient[] = [
  { id: 'PAT-001', nom: 'Kone', prenom: 'Amina', dateNaissance: '1985-03-12', telephone: '97 00 11 22', adresse: 'Cotonou, Zongo', assurance: 'CNSS', numeroAssurance: 'CNSS-4521', tauxCouverture: 40, urgenceNom: 'Kone Ibrahim', urgenceTel: '96 22 33 44' },
  { id: 'PAT-002', nom: 'Adodo', prenom: 'Kofi', dateNaissance: '1990-07-18', telephone: '95 33 44 55', adresse: 'Abomey-Calavi, Lot 12', assurance: null, numeroAssurance: null, tauxCouverture: 0, urgenceNom: 'Adodo Marie', urgenceTel: '97 55 66 77' },
  { id: 'PAT-003', nom: 'Lawson', prenom: 'Adjoa', dateNaissance: '1972-11-05', telephone: '96 44 55 66', adresse: 'Porto-Novo, Tokpota', assurance: 'INAM', numeroAssurance: 'INAM-8812', tauxCouverture: 50, urgenceNom: 'Lawson Kofi', urgenceTel: '95 77 88 99' },
  { id: 'PAT-004', nom: 'Hodonou', prenom: 'Fiacre', dateNaissance: '2001-01-22', telephone: '97 55 66 77', adresse: 'Cotonou, Akpakpa', assurance: 'SONIAM', numeroAssurance: 'SON-2234', tauxCouverture: 35, urgenceNom: 'Hodonou Agnès', urgenceTel: '96 88 99 00' },
  { id: 'PAT-005', nom: 'Dossou', prenom: 'Emeline', dateNaissance: '1965-09-30', telephone: '95 66 77 88', adresse: 'Parakou, Centre', assurance: 'CNSS', numeroAssurance: 'CNSS-7890', tauxCouverture: 40, urgenceNom: 'Dossou Roland', urgenceTel: '97 00 11 22' },
  { id: 'PAT-006', nom: 'Gbessi', prenom: 'Théodore', dateNaissance: '1998-05-14', telephone: '97 77 88 99', adresse: 'Cotonou, Fidjrossè', assurance: null, numeroAssurance: null, tauxCouverture: 0, urgenceNom: 'Gbessi Pierre', urgenceTel: '95 00 11 22' },
];

// ─── Factures ───────────────────────────────────────────────
export type LigneFacture = { libelle: string; qte: number; pu: number };

export type Facture = {
  id: string;
  patientId: string;
  patient: string;
  date: string;
  montantBrut: number;
  assurancePrise: number;
  net: number;
  verse: number;
  statut: 'PAYE' | 'PARTIEL' | 'ANNULE' | 'EN_ATTENTE';
  agent: string;
  modePaiement: 'ESPECES' | 'MOBILE' | 'MIXTE' | null;
  lignes: LigneFacture[];
};

export const FACTURES: Facture[] = [
  { id: 'FAC-20260623-001', patientId: 'PAT-001', patient: 'Kone Amina', date: '2026-06-23', montantBrut: 12500, assurancePrise: 5000, net: 7500, verse: 7500, statut: 'PAYE', agent: 'Ahouansou B.', modePaiement: 'ESPECES', lignes: [{ libelle: 'Consultation générale', qte: 1, pu: 5000 }, { libelle: 'Paracétamol 500mg', qte: 2, pu: 750 }, { libelle: 'Amoxicilline 250mg', qte: 1, pu: 1000 }] },
  { id: 'FAC-20260623-002', patientId: 'PAT-002', patient: 'Adodo Kofi', date: '2026-06-23', montantBrut: 8000, assurancePrise: 0, net: 8000, verse: 4000, statut: 'PARTIEL', agent: 'Codjo M.', modePaiement: 'MOBILE', lignes: [{ libelle: 'Consultation pédiatrie', qte: 1, pu: 6000 }, { libelle: 'Metformine 500mg', qte: 1, pu: 2000 }] },
  { id: 'FAC-20260623-003', patientId: 'PAT-003', patient: 'Lawson Adjoa', date: '2026-06-23', montantBrut: 15000, assurancePrise: 7500, net: 7500, verse: 0, statut: 'EN_ATTENTE', agent: 'Ahouansou B.', modePaiement: null, lignes: [{ libelle: 'Consultation cardiologie', qte: 1, pu: 12000 }, { libelle: 'ECG', qte: 1, pu: 3000 }] },
  { id: 'FAC-20260622-015', patientId: 'PAT-004', patient: 'Hodonou Fiacre', date: '2026-06-22', montantBrut: 5500, assurancePrise: 2750, net: 2750, verse: 2750, statut: 'PAYE', agent: 'Codjo M.', modePaiement: 'MIXTE', lignes: [{ libelle: 'Injection IM', qte: 2, pu: 1500 }, { libelle: 'Seringues', qte: 5, pu: 500 }] },
  { id: 'FAC-20260622-007', patientId: 'PAT-005', patient: 'Dossou Emeline', date: '2026-06-22', montantBrut: 9000, assurancePrise: 0, net: 9000, verse: 9000, statut: 'ANNULE', agent: 'Ahouansou B.', modePaiement: 'ESPECES', lignes: [{ libelle: 'Consultation chirurgie', qte: 1, pu: 9000 }] },
  { id: 'FAC-20260623-004', patientId: 'PAT-006', patient: 'Gbessi Théodore', date: '2026-06-23', montantBrut: 6500, assurancePrise: 0, net: 6500, verse: 6500, statut: 'PAYE', agent: 'Codjo M.', modePaiement: 'MOBILE', lignes: [{ libelle: 'Consultation générale', qte: 1, pu: 5000 }, { libelle: 'Test glycémie', qte: 1, pu: 1500 }] },
];

// ─── Annulations en attente ───────────────────────────────
export type DemandeAnnulation = {
  id: string;
  factureId: string;
  patient: string;
  agent: string;
  motif: string;
  montant: number;
  date: string;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
};

export const ANNULATIONS: DemandeAnnulation[] = [
  { id: 'ANN-001', factureId: 'FAC-20260623-002', patient: 'Adodo Kofi', agent: 'Codjo M.', motif: 'Erreur de saisie sur la prestation principale.', montant: 8000, date: '2026-06-23', statut: 'EN_ATTENTE' },
  { id: 'ANN-002', factureId: 'FAC-20260622-007', patient: 'Dossou Emeline', agent: 'Ahouansou B.', motif: 'Double facturation suite à un problème système.', montant: 9000, date: '2026-06-22', statut: 'EN_ATTENTE' },
];

// ─── Prestations ────────────────────────────────────────────
export type Prestation = {
  id: string;
  code: string;
  libelle: string;
  specialite: string;
  tarif: number;
  actif: boolean;
};

export const PRESTATIONS: Prestation[] = [
  { id: 'P-001', code: 'CONS-GEN', libelle: 'Consultation générale', specialite: 'Médecine générale', tarif: 5000, actif: true },
  { id: 'P-002', code: 'CONS-PED', libelle: 'Consultation pédiatrie', specialite: 'Pédiatrie', tarif: 6000, actif: true },
  { id: 'P-003', code: 'CONS-CAR', libelle: 'Consultation cardiologie', specialite: 'Cardiologie', tarif: 12000, actif: true },
  { id: 'P-004', code: 'ECG', libelle: 'Électrocardiogramme', specialite: 'Cardiologie', tarif: 3000, actif: true },
  { id: 'P-005', code: 'INJ', libelle: 'Injection IM/IV', specialite: 'Soins infirmiers', tarif: 1500, actif: true },
  { id: 'P-006', code: 'RADIO', libelle: 'Radiographie standard', specialite: 'Radiologie', tarif: 8000, actif: false },
  { id: 'P-007', code: 'GLYC', libelle: 'Test de glycémie', specialite: 'Biologie', tarif: 1500, actif: true },
];

// ─── Assurances ──────────────────────────────────────────────
export type Assurance = {
  id: string;
  code: string;
  nom: string;
  taux: number;
  contact: string;
  actif: boolean;
};

export const ASSURANCES: Assurance[] = [
  { id: 'A-001', code: 'CNSS', nom: 'Caisse Nationale de Sécurité Sociale', taux: 40, contact: 'cnss@bj.bj', actif: true },
  { id: 'A-002', code: 'INAM', nom: 'Institut National d\'Assurance Maladie', taux: 50, contact: 'inam@gouv.bj', actif: true },
  { id: 'A-003', code: 'SONIAM', nom: 'Société Nationale d\'Assurance Maladie', taux: 35, contact: 'soniam@bj.bj', actif: true },
  { id: 'A-004', code: 'GIZ', nom: 'GIZ Assurance Santé', taux: 60, contact: 'giz@bj.bj', actif: false },
];

// ─── Stock ───────────────────────────────────────────────────
export type ArticleStock = {
  id: string;
  code: string;
  libelle: string;
  categorie: string;
  unite: string;
  quantite: number;
  seuil: number;
  pu: number;
};

export const STOCK_ARTICLES: ArticleStock[] = [
  { id: 'MED-001', code: 'MED-001', libelle: 'Paracétamol 500 mg', categorie: 'Médicament', unite: 'boîte', quantite: 48, seuil: 20, pu: 750 },
  { id: 'MED-002', code: 'MED-002', libelle: 'Amoxicilline 250 mg', categorie: 'Médicament', unite: 'boîte', quantite: 12, seuil: 15, pu: 1800 },
  { id: 'MAT-001', code: 'MAT-001', libelle: 'Seringues 5 ml', categorie: 'Matériel', unite: 'carton', quantite: 5, seuil: 10, pu: 3500 },
  { id: 'MED-003', code: 'MED-003', libelle: 'Metformine 500 mg', categorie: 'Médicament', unite: 'boîte', quantite: 30, seuil: 10, pu: 2100 },
  { id: 'MAT-002', code: 'MAT-002', libelle: 'Gants latex M', categorie: 'Matériel', unite: 'boîte', quantite: 0, seuil: 5, pu: 4200 },
  { id: 'MED-004', code: 'MED-004', libelle: 'Ibuprofène 400 mg', categorie: 'Médicament', unite: 'boîte', quantite: 25, seuil: 10, pu: 900 },
  { id: 'MAT-003', code: 'MAT-003', libelle: 'Compresses stériles', categorie: 'Matériel', unite: 'sachet', quantite: 80, seuil: 30, pu: 200 },
];

export type MouvementStock = {
  id: string;
  articleId: string;
  article: string;
  type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT' | 'TRANSFERT';
  quantite: number;
  date: string;
  agent: string;
  motif: string;
};

export const MOUVEMENTS_STOCK: MouvementStock[] = [
  { id: 'MOV-001', articleId: 'MED-001', article: 'Paracétamol 500 mg', type: 'ENTREE', quantite: 50, date: '2026-06-23 09:14', agent: 'Hodonou F.', motif: 'Livraison fournisseur' },
  { id: 'MOV-002', articleId: 'MAT-001', article: 'Seringues 5 ml', type: 'SORTIE', quantite: 10, date: '2026-06-23 10:32', agent: 'Hodonou F.', motif: 'Demande pharmacie' },
  { id: 'MOV-003', articleId: 'MED-002', article: 'Amoxicilline 250 mg', type: 'SORTIE', quantite: 3, date: '2026-06-23 11:05', agent: 'Hodonou F.', motif: 'Demande pharmacie' },
  { id: 'MOV-004', articleId: 'MAT-002', article: 'Gants latex M', type: 'AJUSTEMENT', quantite: -5, date: '2026-06-22 16:00', agent: 'Hodonou F.', motif: 'Inventaire physique' },
];

// ─── Utilisateurs ────────────────────────────────────────────
export type Utilisateur = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  actif: boolean;
  creeLe: string;
};

export const UTILISATEURS: Utilisateur[] = [
  { id: 'U-001', nom: 'Ahouansou', prenom: 'Brice', email: 'b.ahouansou@clinicflow.bj', telephone: '97 11 22 33', role: 'Agent de caisse', actif: true, creeLe: '2025-01-10' },
  { id: 'U-002', nom: 'Codjo', prenom: 'Marie', email: 'm.codjo@clinicflow.bj', telephone: '95 22 33 44', role: 'Agent de caisse', actif: true, creeLe: '2025-01-10' },
  { id: 'U-003', nom: 'Dossou', prenom: 'Roland', email: 'r.dossou@clinicflow.bj', telephone: '96 33 44 55', role: 'Responsable de caisse', actif: false, creeLe: '2025-02-15' },
  { id: 'U-004', nom: 'Hodonou', prenom: 'Fiacre', email: 'f.hodonou@clinicflow.bj', telephone: '97 44 55 66', role: 'Agent magasinier', actif: true, creeLe: '2025-03-01' },
  { id: 'U-005', nom: 'Lawson', prenom: 'Martine', email: 'm.lawson@clinicflow.bj', telephone: '95 55 66 77', role: 'Ressources humaines', actif: true, creeLe: '2025-01-05' },
  { id: 'U-006', nom: 'Gbaguidi', prenom: 'Achille', email: 'a.gbaguidi@clinicflow.bj', telephone: '96 66 77 88', role: 'Promoteur', actif: true, creeLe: '2024-12-01' },
];

// ─── Médecins ────────────────────────────────────────────────
export type Medecin = {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email: string;
  actif: boolean;
};

export const MEDECINS: Medecin[] = [
  { id: 'M-001', nom: 'Agossou', prenom: 'Christophe', specialite: 'Médecine générale', telephone: '97 11 22 33', email: 'c.agossou@clinicflow.bj', actif: true },
  { id: 'M-002', nom: 'Bossa', prenom: 'Isabelle', specialite: 'Pédiatrie', telephone: '96 22 33 44', email: 'i.bossa@clinicflow.bj', actif: true },
  { id: 'M-003', nom: 'Capo', prenom: 'Lionel', specialite: 'Cardiologie', telephone: '95 33 44 55', email: 'l.capo@clinicflow.bj', actif: true },
  { id: 'M-004', nom: 'Dossou', prenom: 'Valérie', specialite: 'Chirurgie', telephone: '97 44 55 66', email: 'v.dossou@clinicflow.bj', actif: false },
];

export const SPECIALITES = [
  'Médecine générale', 'Pédiatrie', 'Cardiologie', 'Chirurgie',
  'Radiologie', 'Gynécologie', 'Dermatologie', 'Soins infirmiers', 'Biologie',
];

export const ROLES_LIST = [
  'Promoteur', 'Responsable de caisse', 'Agent de caisse', 'Agent magasinier', 'Ressources humaines',
];

// ─── Helpers ─────────────────────────────────────────────────
export function fmt(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export const STATUT_LABELS: Record<string, string> = {
  PAYE: 'Payée', PARTIEL: 'Partielle', ANNULE: 'Annulée', EN_ATTENTE: 'En attente',
};

export const STATUT_VARIANTS: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  PAYE: 'success', PARTIEL: 'warning', ANNULE: 'destructive', EN_ATTENTE: 'secondary',
};

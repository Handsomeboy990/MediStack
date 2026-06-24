import { PRESTATIONS, type Facture, type LigneFacture, type Patient, type Utilisateur } from './mock-data';
import type { LogEntry } from './logs-store';

const FIRST_NAMES = [
  'Amina', 'Kofi', 'Adjoa', 'Brice', 'Mireille', 'Jules', 'Sonia', 'Didier', 'Nadia', 'Romain',
  'Fatou', 'Nestor', 'Ines', 'Marc', 'Carine', 'Frederic', 'Alice', 'Raoul', 'Clarisse', 'Yves',
];

const LAST_NAMES = [
  'Adodo', 'Kone', 'Lawson', 'Hodonou', 'Dossou', 'Sossa', 'Agossou', 'Bocco', 'Capo', 'Mensah',
  'Djossou', 'Kpadonou', 'Ahouansou', 'Sodjinou', 'Tchegnon', 'Gbaguidi', 'Anagonou', 'Tossou', 'Biaou', 'Yovo',
];

const ADDRESSES = [
  'Cotonou, Zongo',
  'Cotonou, Akpakpa',
  'Abomey-Calavi, Godomey',
  'Porto-Novo, Tokpota',
  'Parakou, Centre',
  'Bohicon, Haie Vive',
  'Ouidah, Centre-ville',
  'Seme-Podji, Ekpe',
];

const ROLES = [
  'Administrateur',
  'Médecin',
  'Responsable de caisse',
  'Agent de caisse',
  'Agent magasinier',
  'Ressources humaines',
];

const AGENTS_CAISSE = ['Ahouansou B.', 'Codjo M.', 'Sossou R.', 'Adjinan C.'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(list: T[]) {
  return list[randomInt(0, list.length - 1)];
}

function pad(n: number, len = 3) {
  return String(n).padStart(len, '0');
}

function randomPhone() {
  return `01 ${randomInt(90, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)}`;
}

function randomDateWithin(daysBack: number) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysBack));
  return d.toISOString().slice(0, 10);
}

function randomBirthDate() {
  const year = randomInt(1955, 2005);
  const month = pad(randomInt(1, 12), 2);
  const day = pad(randomInt(1, 28), 2);
  return `${year}-${month}-${day}`;
}

export function generatePatients(total: number): Patient[] {
  const out: Patient[] = [];
  for (let i = 1; i <= total; i += 1) {
    const prenom = pick(FIRST_NAMES);
    const nom = pick(LAST_NAMES);
    const insured = Math.random() < 0.55;

    out.push({
      id: `PAT-${pad(i)}`,
      nom,
      prenom,
      dateNaissance: randomBirthDate(),
      telephone: randomPhone(),
      adresse: pick(ADDRESSES),
      urgenceNom: `${pick(LAST_NAMES)} ${pick(FIRST_NAMES)}`,
      urgenceTel: randomPhone(),
      cartesAssurance: insured
        ? [{
          id: `CA-${pad(i)}`,
          nom: pick(['CNSS', 'INAM', 'SONIAM', 'GIZ']),
          societe: 'Assurance Santé',
          numeroPolice: `POL-${randomInt(1000, 9999)}`,
          numeroMatricule: `MAT-${randomInt(1000, 9999)}`,
          dateExpiration: `${randomInt(2026, 2028)}-12-31`,
          taux: pick([30, 35, 40, 50, 60]),
        }]
        : [],
    });
  }
  return out;
}

function randomLignes(): LigneFacture[] {
  const active = PRESTATIONS.filter((p) => p.actif);
  const count = randomInt(1, 4);
  const lines: LigneFacture[] = [];

  for (let i = 0; i < count; i += 1) {
    const p = pick(active);
    lines.push({
      libelle: p.libelle,
      qte: randomInt(1, 3),
      pu: p.tarif,
    });
  }

  return lines;
}

export function generateFactures(total: number, patients: Patient[]): Facture[] {
  const out: Facture[] = [];

  for (let i = 1; i <= total; i += 1) {
    const patient = pick(patients);
    const lignes = randomLignes();
    const brut = lignes.reduce((s, l) => s + l.qte * l.pu, 0);
    const taux = patient.cartesAssurance[0]?.taux ?? 0;
    const assurance = Math.round((brut * taux) / 100);
    const net = brut - assurance;

    const paymentMode = pick(['ESPECES', 'MOBILE', 'MIXTE']);
    const r = Math.random();
    const statut: Facture['statut'] = r < 0.62 ? 'PAYE' : r < 0.82 ? 'PARTIEL' : r < 0.95 ? 'EN_ATTENTE' : 'ANNULE';
    const verse = statut === 'PAYE' ? net : statut === 'PARTIEL' ? randomInt(Math.max(1, Math.floor(net * 0.25)), Math.max(1, Math.floor(net * 0.9))) : 0;

    const date = randomDateWithin(45);
    const dateCompact = date.replaceAll('-', '');

    out.push({
      id: `FAC-${dateCompact}-${pad(i)}`,
      patientId: patient.id,
      patient: `${patient.prenom} ${patient.nom}`,
      date,
      montantBrut: brut,
      assurancePrise: assurance,
      net,
      verse,
      statut,
      agent: pick(AGENTS_CAISSE),
      modePaiement: statut === 'EN_ATTENTE' ? null : paymentMode,
      lignes,
      origine: Math.random() < 0.3 ? 'PRESCRIPTION' : 'MANUEL',
      prescriptionId: Math.random() < 0.3 ? `ORD-${dateCompact}-${pad(i)}` : null,
      estBrouillon: statut === 'EN_ATTENTE' && Math.random() < 0.4,
    });
  }

  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function generateUtilisateurs(total: number): Utilisateur[] {
  const out: Utilisateur[] = [];
  for (let i = 1; i <= total; i += 1) {
    const prenom = pick(FIRST_NAMES);
    const nom = pick(LAST_NAMES);
    out.push({
      id: `U-${pad(i)}`,
      nom,
      prenom,
      email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@meditrust.bj`,
      telephone: `${randomInt(90, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)} ${randomInt(10, 99)}`,
      role: pick(ROLES),
      actif: Math.random() > 0.12,
      creeLe: randomDateWithin(220),
    });
  }
  return out;
}

const ENTITIES = ['Patient', 'Facture', 'Utilisateur', 'Prescription', 'Stock', 'Paiement'];
const ACTIONS: Array<LogEntry['action']> = ['CREATE', 'UPDATE', 'DELETE'];

export function generateLogs(total: number): LogEntry[] {
  const out: LogEntry[] = [];
  for (let i = 1; i <= total; i += 1) {
    const user = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES).charAt(0)}.`;
    const entity = pick(ENTITIES);
    const action = pick(ACTIONS);
    out.push({
      id: `LOG-${Date.now()}-${i}`,
      date: new Date(Date.now() - i * randomInt(10, 200) * 60000).toISOString(),
      user,
      action,
      entity,
      description: `${action} ${entity} (événement démo ${i})`,
    });
  }
  return out;
}

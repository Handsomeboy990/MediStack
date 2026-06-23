import { PrismaClient } from '@prisma/client';

// Real insurers operating in Benin, used as reference data. Adjust contact
// details as needed; they are illustrative.
const insurers = [
  {
    name: 'SUNU Assurances Bénin',
    description: 'Compagnie d’assurances vie et non-vie.',
    address: 'Avenue Steinmetz, Cotonou, Bénin',
    phoneNumbers: ['+22921312424'],
    email: 'contact@sunu-group.com',
    website: 'https://www.sunu-group.com',
    contactPerson: 'Service clientèle',
  },
  {
    name: 'NSIA Assurances Bénin',
    description: 'Assurances santé, automobile et entreprises.',
    address: 'Boulevard Saint Michel, Cotonou, Bénin',
    phoneNumbers: ['+22921315050'],
    email: 'info@nsiabenin.bj',
    website: 'https://www.groupensia.com',
    contactPerson: 'Service clientèle',
  },
  {
    name: 'Atlantique Assurance Bénin',
    description: 'Solutions d’assurance pour particuliers et entreprises.',
    address: 'Rue 12.05, Cotonou, Bénin',
    phoneNumbers: ['+22921300101'],
    email: 'contact@atlantique-assurance.bj',
    website: 'https://www.atlantiqueassurance.com',
    contactPerson: 'Service clientèle',
  },
  {
    name: 'Africaine des Assurances Bénin',
    description: 'Compagnie d’assurances multirisques.',
    address: 'Carré 1245, Cotonou, Bénin',
    phoneNumbers: ['+22921326060'],
    email: 'info@africaine-assurances.bj',
    website: 'https://www.africaine-assurances.com',
    contactPerson: 'Service clientèle',
  },
  {
    name: 'Sanlam Assurances Bénin',
    description: 'Assurances vie et santé (ex-Saham).',
    address: 'Avenue Jean-Paul II, Cotonou, Bénin',
    phoneNumbers: ['+22921317070'],
    email: 'contact@sanlam.bj',
    website: 'https://www.sanlam.com',
    contactPerson: 'Service clientèle',
  },
  {
    name: 'Allianz Bénin',
    description: 'Assurances santé, dommages et prévoyance.',
    address: 'Boulevard de la Marina, Cotonou, Bénin',
    phoneNumbers: ['+22921318080'],
    email: 'contact@allianz.bj',
    website: 'https://www.allianz.bj',
    contactPerson: 'Service clientèle',
  },
];

// Idempotent: name is not unique in the schema, so guard by name before create.
export async function seedInsuranceOrganisations(
  prisma: PrismaClient,
): Promise<void> {
  for (const insurer of insurers) {
    const existing = await prisma.insuranceOrganisation.findFirst({
      where: { name: insurer.name },
    });
    if (!existing) {
      await prisma.insuranceOrganisation.create({ data: insurer });
    }
  }
}

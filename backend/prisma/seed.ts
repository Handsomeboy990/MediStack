import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// MediTrust application roles. The rest of the dataset will be added when the
// business modules are implemented. The libelle stays in French because it is
// displayed in the user interface.
const roles = [
  { code: 'PROMOTEUR', libelle: 'Promoteur' },
  { code: 'RESP_CAISSE', libelle: 'Responsable de caisse' },
  { code: 'AGENT_CAISSE', libelle: 'Agent de caisse' },
  { code: 'AGENT_MAGASIN', libelle: 'Agent magasinier' },
  { code: 'RH', libelle: 'Ressources humaines' },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
  }
  console.log('Roles seeded.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

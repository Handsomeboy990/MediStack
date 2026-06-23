import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedInsuranceOrganisations } from './seeders/insurance-organisations.seeder';

const prisma = new PrismaClient();

// Bootstrap administrator account. The password must be changed after the first
// login. Used to access the system before the user management module exists.
const BOOTSTRAP_ADMIN = {
  fullName: 'System Administrator',
  username: 'admin',
  password: 'Admin@123',
};

// Application roles (see docs/ROLE_AND_PERMISSIONS.md).
const roles = [
  { name: 'super_admin', description: 'Main system administrator' },
  { name: 'cash_manager', description: 'Cash desk manager' },
  { name: 'cashier', description: 'Cashier agent' },
  { name: 'store_keeper', description: 'Storekeeper' },
  { name: 'hr_manager', description: 'HR manager' },
];

// Granular permissions, format resource:action (see docs/ROLE_AND_PERMISSIONS.md).
const permissions = [
  { name: 'user:create', description: 'Create a user' },
  { name: 'user:read', description: 'Read users' },
  { name: 'user:update', description: 'Update a user' },
  { name: 'user:delete', description: 'Delete a user' },
  { name: 'user:disable', description: 'Disable a user' },
  { name: 'patient:create', description: 'Register a patient' },
  { name: 'patient:read', description: 'Read a patient' },
  { name: 'patient:update', description: 'Update a patient' },
  { name: 'service:create', description: 'Create a service' },
  { name: 'service:read', description: 'Read services' },
  { name: 'service:update', description: 'Update a service' },
  { name: 'service:delete', description: 'Delete a service' },
  { name: 'invoice:create', description: 'Create an invoice' },
  { name: 'invoice:read', description: 'Read an invoice' },
  { name: 'invoice:update', description: 'Update an invoice' },
  { name: 'invoice:print', description: 'Print an invoice' },
  { name: 'payment:create', description: 'Collect a payment' },
  { name: 'payment:read', description: 'Read payments' },
  { name: 'discount:apply', description: 'Apply a discount' },
  {
    name: 'invoice:cancel_request',
    description: 'Request an invoice cancellation',
  },
  { name: 'invoice:cancel_approve', description: 'Approve a cancellation' },
  { name: 'invoice:cancel_reject', description: 'Reject a cancellation' },
  { name: 'stock:read', description: 'Read stock' },
  { name: 'stock_central:manage', description: 'Manage central stock' },
  { name: 'stock:transfer', description: 'Transfer stock' },
  { name: 'stock_movement:read', description: 'Read stock movements' },
  { name: 'notification:read', description: 'Read notifications' },
  { name: 'revenue:own_read', description: 'Read own revenue' },
  { name: 'revenue:cashier_read', description: 'Read a cashier revenue' },
  { name: 'revenue:global_read', description: 'Read global revenue' },
  { name: 'statistics:read', description: 'Read statistics' },
  { name: 'statistics:specialty', description: 'Statistics by specialty' },
  { name: 'statistics:doctor', description: 'Statistics by doctor' },
  { name: 'statistics:period', description: 'Statistics over a period' },
  { name: 'doctor:create', description: 'Create a doctor' },
  { name: 'doctor:read', description: 'Read doctors' },
  { name: 'doctor:update', description: 'Update a doctor' },
  { name: 'doctor:disable', description: 'Disable a doctor' },
  { name: 'specialty:read', description: 'Read specialties' },
  {
    name: 'insurance:read',
    description: 'Read insurers and patient memberships',
  },
  {
    name: 'insurance:create',
    description: 'Attach an insurance membership to a patient',
  },
  { name: 'insurance:update', description: 'Update an insurance membership' },
  { name: 'insurance:delete', description: 'Remove an insurance membership' },
];

// Role to permissions mapping. super_admin gets every permission.
const rolePermissions: Record<string, string[]> = {
  super_admin: permissions.map((permission) => permission.name),
  cash_manager: [
    'service:create',
    'service:read',
    'service:update',
    'service:delete',
    'invoice:read',
    'invoice:cancel_approve',
    'invoice:cancel_reject',
    'revenue:cashier_read',
    'revenue:global_read',
  ],
  cashier: [
    'patient:create',
    'patient:read',
    'patient:update',
    'invoice:create',
    'invoice:read',
    'invoice:update',
    'invoice:print',
    'payment:create',
    'payment:read',
    'discount:apply',
    'invoice:cancel_request',
    'revenue:own_read',
    'insurance:read',
    'insurance:create',
    'insurance:update',
    'insurance:delete',
  ],
  store_keeper: [
    'stock:read',
    'stock_central:manage',
    'stock:transfer',
    'stock_movement:read',
    'notification:read',
  ],
  hr_manager: [
    'user:read',
    'user:update',
    'user:disable',
    'doctor:create',
    'doctor:read',
    'doctor:update',
    'doctor:disable',
    'specialty:read',
  ],
};

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
  }

  for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: roleName },
    });
    for (const permissionName of permissionNames) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { name: permissionName },
      });
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: permission.id },
        },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const superAdmin = await prisma.role.findUniqueOrThrow({
    where: { name: 'super_admin' },
  });
  const passwordHash = await bcrypt.hash(BOOTSTRAP_ADMIN.password, 10);
  await prisma.user.upsert({
    where: { username: BOOTSTRAP_ADMIN.username },
    update: {},
    create: {
      fullName: BOOTSTRAP_ADMIN.fullName,
      username: BOOTSTRAP_ADMIN.username,
      password: passwordHash,
      roleId: superAdmin.id,
    },
  });

  await seedInsuranceOrganisations(prisma);

  console.log(
    'Roles, permissions, role permissions, admin user and insurers seeded.',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

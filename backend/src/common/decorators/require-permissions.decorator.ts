import { SetMetadata } from '@nestjs/common';

// Declares the permissions required to access a route. The global
// PermissionsGuard reads this metadata and enforces it.
export const PERMISSIONS_KEY = 'requiredPermissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

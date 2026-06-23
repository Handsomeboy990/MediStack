import { AuthenticatedUser } from './authenticated-user.interface';

// Augments the Express request with the authenticated user attached by the
// JwtAuthGuard.
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};

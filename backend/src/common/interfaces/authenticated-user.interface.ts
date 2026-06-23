// Shape of the authenticated user attached to the request by the JwtAuthGuard.
// It mirrors the JWT payload once the token has been verified.
export interface AuthenticatedUser {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}

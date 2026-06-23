// Payload signed into the JWT at login and verified by the JwtAuthGuard.
export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  permissions: string[];
}

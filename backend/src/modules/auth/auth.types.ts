import type { Role } from '@prisma/client';

// ─── Response types ──────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  ownerId: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
}

// ─── JWT helpers ─────────────────────────────────────────

export type JwtDuration = `${number}${'s' | 'm' | 'h' | 'd'}`;

const JWT_DURATION_REGEX = /^\d+[smhd]$/;

export function isValidJwtDuration(value: string): value is JwtDuration {
  return JWT_DURATION_REGEX.test(value);
}

// ============================================================
// USER / AUTH TYPES
// ============================================================

export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;   // initials e.g. "KY"
  avatarUri?: string; // uploaded photo URI
  role: UserRole;
  city?: string;
  address?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CartItem {
  part: import('./Part').Part;
  quantity: number;
}

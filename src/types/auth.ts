/** Backend auth response (no JWT): token is null, userId and role identify the user */
export interface AuthResponseDTO {
  token: string | null;
  userId?: number;
  id?: string | number;
  role?: string;
}

/** Aligns with backend RegisterRequestDTO; role must match Java enum */
export type RoleEnum = 'ENTREPRENEUR' | 'INVESTOR';

export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: RoleEnum;
  domainType: string;
}

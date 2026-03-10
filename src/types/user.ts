/** User list item from backend (e.g. GET /users/all) */
export interface UserListItem {
  id: string | number;
  username?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

/** Profile user from backend (e.g. GET /users/:id) */
export interface ProfileUser {
  id: string | number;
  username?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  role?: string;
  location?: string;
  /** Total number of connections this profile has */
  connectionCount?: number;
  /** Total number of posts this profile has authored */
  postCount?: number;
  /** Relationship between the viewing user and this profile */
  connectionStatus?: 'SELF' | 'NONE' | 'PENDING' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';
  [key: string]: unknown;
}

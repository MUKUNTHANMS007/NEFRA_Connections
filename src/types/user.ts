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
  [key: string]: unknown;
}

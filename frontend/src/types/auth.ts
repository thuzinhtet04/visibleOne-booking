export type Role = "admin" | "owner" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

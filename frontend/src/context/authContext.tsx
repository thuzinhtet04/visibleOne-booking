import { createContext, useContext, type ReactNode } from "react";
import { useSession } from "../lib/auth-client";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isPending: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const user = session?.user
    ? ({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role, // additionalFields aren't typed by default, see note below
        image: session.user.image,
      } as AuthUser)
    : null;

  return (
    <AuthContext.Provider value={{ user, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

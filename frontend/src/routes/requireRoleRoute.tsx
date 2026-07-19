// routes/RequireRole.tsx
import { Navigate, Outlet } from "react-router-dom";

import type { Role } from "../types/auth";
import { useAuth } from "../context/authContext";

interface RequireRoleProps {
  allowedRoles: Role[];
}

export function RequireRole({ allowedRoles }: RequireRoleProps) {
  const { user, isPending } = useAuth();

  if (isPending) return <p>Loading...</p>;

  const isAuthorized = Boolean(user && allowedRoles.includes(user.role));

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

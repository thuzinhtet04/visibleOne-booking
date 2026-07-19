import { useState, useEffect, useCallback } from "react";
import type { Role } from "../types/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/users/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (name: string, email: string, password: string, role: Role) => {
      const res = await fetch(`/api/v1/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to create user");
      }
      await fetchUsers();
    },
    [fetchUsers],
  );

  const updateUserRole = useCallback(
    async (userId: string, role: Role) => {
      const res = await fetch(`/api/v1/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update role");
      }
      await fetchUsers();
    },
    [fetchUsers],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      const res = await fetch(`/api/v1/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to delete user");
      }
      await fetchUsers();
    },
    [fetchUsers],
  );

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUserRole,
    deleteUser,
  };
}

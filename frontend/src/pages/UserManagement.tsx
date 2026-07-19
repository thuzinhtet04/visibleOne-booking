import { useState, useMemo, useTransition } from "react";
import { Search, Plus, Trash2, Loader2, X } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useUsers, type User } from "../hooks/useUsers";
import type { Role } from "../types/auth";

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, createUser, updateUserRole, deleteUser } =
    useUsers();
  const [search, setSearch] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [, startTransition] = useTransition();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Role>("user");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      deferredSearch
        ? users.filter(
            (u) =>
              u.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
              u.email.toLowerCase().includes(deferredSearch.toLowerCase()),
          )
        : users,
    [users, deferredSearch],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      await createUser(newName, newEmail, newPassword, newRole);
      setShowCreate(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("user");
    } catch (err) {
      setCreateError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRoleChange(userId: string, role: Role) {
    setUpdatingRoleId(userId);
    try {
      await updateUserRole(userId, role);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUpdatingRoleId(null);
    }
  }

  async function handleDelete() {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-md">
        <h1 className="text-headline-md text-on-surface">User Management</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
        <div className="p-md border-b border-outline-variant">
          <div className="relative w-60">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                startTransition(() => setDeferredSearch(e.target.value));
              }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="divide-y divide-outline-variant">
          {loading && (
            <div className="flex items-center justify-center py-12 text-on-surface-variant text-sm">
              Loading users...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center py-12 text-error text-sm">
              {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex items-center justify-center py-12 text-on-surface-variant text-sm">
              {search ? "No users match your search." : "No users found."}
            </div>
          )}
          {!loading &&
            !error &&
            filtered.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-4 p-md hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-on-surface truncate">
                    {u.name}
                  </h4>
                  <p className="text-sm text-on-surface-variant truncate">
                    {u.email}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={u.role}
                      disabled={updatingRoleId === u.id}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as Role)
                      }
                      className="text-sm appearance-none bg-surface-container-low border border-outline-variant rounded-lg pl-2 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                      <svg
                        className="h-4 w-4 text-on-surface-variant"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {updatingRoleId === u.id && (
                    <Loader2 className="w-4 h-4 animate-spin text-on-surface-variant" />
                  )}
                </div>

                <button
                  onClick={() => setUserToDelete(u)}
                  disabled={u.id === currentUser?.id}
                  className="shrink-0 p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* Fixed: Replaced max-w-md with max-w-[448px] to bypass theme token conflicts */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg w-full max-w-[448px] mx-4">
            <div className="flex items-center justify-between mb-md">
              <h2 className="text-title-sm text-on-surface">Create User</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-md">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-background px-sm py-xs text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-background px-sm py-xs text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-background px-sm py-xs text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="w-full appearance-none rounded-lg border border-outline-variant bg-background pl-sm pr-10 py-xs text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                  {/* Clean, perfectly centered custom arrow icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-sm">
                    <svg
                      className="h-4 w-4 text-on-surface-variant"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {createError && (
                <p className="text-error text-sm">{createError}</p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg w-full max-w-1/3 mx-4">
            <h2 className="text-title-sm text-on-surface mb-sm">Delete User</h2>
            <p className="text-body-sm text-on-surface mb-md">
              Are you sure you want to delete{" "}
              <strong>{userToDelete.name}</strong>?
            </p>
            <p className="text-body-sm text-error mb-md">
              All meetings created by this user will also be permanently
              deleted.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-error text-on-error rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

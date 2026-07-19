import type { Role } from "../types/auth";

const styles: Record<Role, string> = {
  admin:
    "bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-blue-200",
  owner:
    "bg-[var(--color-success-light)] text-[var(--color-success)] border border-green-200",
  user: "bg-slate-100 text-slate-600 border border-slate-200",
};

const labels: Record<Role, string> = {
  admin: "Admin",
  owner: "Owner",
  user: "User",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${styles[role]}`}
    >
      {labels[role]}
    </span>
  );
}

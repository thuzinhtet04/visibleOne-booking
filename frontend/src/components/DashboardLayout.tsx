import { Outlet, Link, NavLink } from "react-router-dom";
import { signOut } from "../lib/auth-client";
import { useAuth } from "../context/authContext";
import { BarChart2, CalendarDays, LogOut, Menu, Users, X } from "lucide-react";
import RoleBadge from "./RoleBadge";
import { useState } from "react";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-light text-primary"
      : "text-text-muted hover:bg-background hover:text-text"
  }`;
}

export function DashboardLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  console.log("dashboard reach");

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top navbar */}
      <header className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text text-base hidden sm:block">
              MeetBook
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" end className={navLinkClass}>
              <CalendarDays className="w-4 h-4" />
              Bookings
            </NavLink>
            {(user!.role === "owner" || user!.role === "admin") && (
              <NavLink to="/dashboard/summary" className={navLinkClass}>
                <BarChart2 className="w-4 h-4" />
                Summary
              </NavLink>
            )}
            {user!.role === "admin" && (
              <NavLink to="/dashboard/users" className={navLinkClass}>
                <Users className="w-4 h-4" />
                Users
              </NavLink>
            )}
          </nav>

          {/* Right side: user info + sign out */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex  items-center gap-0.5">
              <span className="text-sm font-medium text-text leading-tight">
                {user!.name}
              </span>
              <RoleBadge role={user!.role} />
            </div>

            <button
              onClick={handleSignOut}
              title="Sign out"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-background hover:text-danger transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:block">Sign out</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-text-muted hover:bg-background transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <span className="text-sm font-medium text-text">
                {user!.name}
              </span>
              <RoleBadge role={user!.role} />
            </div>
            <NavLink
              to="/dashboard"
              end
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              <CalendarDays className="w-4 h-4" />
              Bookings
            </NavLink>
            {(user!.role === "owner" || user!.role === "admin") && (
              <NavLink
                to="/dashboard/summary"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                <BarChart2 className="w-4 h-4" />
                Summary
              </NavLink>
            )}
            {user!.role === "admin" && (
              <NavLink
                to="/dashboard/users"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                <Users className="w-4 h-4" />
                Users
              </NavLink>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium text-danger hover:bg-danger-light transition-colors mt-1"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

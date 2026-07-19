import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp, authClient } from "../lib/auth-client";
import { CalendarDays } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signUp.email({ name, email, password });

    if (error) {
      setLoading(false);
      setError(error.message ?? "Sign up failed");
      return;
    }

    await authClient.$store.atoms.session.get().refetch();
    setLoading(false);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-4 shadow-lg">
            <CalendarDays className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
            Meeting Room Booking
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface-container-low)] rounded-2xl shadow-sm border border-[var(--color-outline-variant)] p-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Error */}
            {error && (
              <div className="rounded-lg bg-[var(--color-error-container)] border border-[var(--color-error)]/30 px-4 py-3 text-sm text-[var(--color-error)] font-medium">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-[var(--color-on-surface)]"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--color-on-surface)]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[var(--color-on-surface)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-[var(--color-primary)] hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm transition-all"
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, authClient } from "../lib/auth-client";
import { CalendarDays } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn.email({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message ?? "Sign in failed");
      return;
    }

    await authClient.$store.atoms.session.get().refetch();
    setLoading(false);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-sm">
      {/* Fixed: Changed max-w-sm to an explicit pixel width to prevent token conflicts */}
      <div className="w-full max-w-[384px]">
        <div className="flex flex-col items-center mb-lg">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-md shadow-lg">
            <CalendarDays className="w-7 h-7 text-on-primary" />
          </div>
          <h1 className="text-headline-md font-bold text-on-surface tracking-tight text-center">
            Meeting Room Booking
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-xs text-center">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-surface-container-low rounded-xl shadow-sm border border-outline-variant p-lg">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-md"
            noValidate
          >
            {error && (
              <div className="rounded-lg bg-error-container border border-error/30 px-md py-sm text-body-sm text-error font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="email"
                className="text-body-sm font-medium text-on-surface"
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
                className="w-full rounded-lg border border-outline-variant bg-background px-sm py-xs text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="password"
                className="text-body-sm font-medium text-on-surface"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-outline-variant bg-background px-sm py-xs text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-xs w-full rounded-lg bg-primary hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-semibold py-sm text-body-sm transition-all"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

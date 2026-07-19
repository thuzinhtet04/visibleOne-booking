import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6">
      <div className="max-w-2/3 text-center">
        <h1 className="text-8xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600">
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-3 font-medium  "
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <Search size={18} />
            Previous Page
          </button>
        </div>
      </div>
    </div>
  );
}

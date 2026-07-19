import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-2/3 rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h1>

        <p className="mt-3 text-gray-600">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => window.history.back()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            <Home size={18} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

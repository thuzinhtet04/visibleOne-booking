// layouts/RootLayout.tsx
import { Outlet, Link } from "react-router-dom";

export function RootLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

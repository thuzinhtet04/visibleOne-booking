// router.tsx
import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import CreateBooking from "../pages/CreateBooking";
import Summary from "../pages/Summary";
import UserManagement from "../pages/UserManagement";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Unauthorized from "../pages/Unauthorized";
import { ProtectedRoute } from "./protectedRoute";

import { RequireRole } from "./requireRoleRoute";
import NotFound from "../pages/NotFound";
import { DashboardLayout } from "../components/DashboardLayout";

const routes: RouteObject[] = [
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "unauthorized", element: <Unauthorized /> },

  {
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "settings", element: <Home /> },
          { path: "create", element: <CreateBooking /> },

          {
            element: <RequireRole allowedRoles={["owner", "admin"]} />, // check authorization and redirect
            children: [{ path: "summary", element: <Summary /> }],
          },
          {
            element: <RequireRole allowedRoles={["admin"]} />,
            children: [
              { path: "admin", element: <Home /> },
              { path: "users", element: <UserManagement /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export const router = createBrowserRouter(routes);

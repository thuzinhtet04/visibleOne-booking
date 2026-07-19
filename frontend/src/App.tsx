import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { router } from "./routes/router";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

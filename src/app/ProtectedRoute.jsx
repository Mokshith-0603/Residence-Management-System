import { Navigate } from "react-router-dom";
import { useAuth } from "../services/auth.service";

export default function ProtectedRoute({ children }) {
  const user = useAuth();

  if (user === undefined) return null; // loading

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

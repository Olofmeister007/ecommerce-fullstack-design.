import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// adminOnly = true  → only admins can enter
// adminOnly = false → any logged-in user can enter
export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = useAuthStore(s => s.token);
  const user  = useAuthStore(s => s.user);

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
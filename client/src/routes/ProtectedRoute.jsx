import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/feedback/LoadingScreen";

export const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to={user?.role === "Admin" ? "/admin" : "/cadet"} replace />;

  return <Outlet />;
};

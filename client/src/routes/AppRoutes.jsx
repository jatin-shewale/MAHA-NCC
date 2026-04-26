import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/feedback/LoadingScreen";
import { LandingPage } from "../pages/shared/LandingPage";
import { LoginPage } from "../pages/shared/LoginPage";
import { RegisterPage } from "../pages/shared/RegisterPage";
import { ForgotPasswordPage } from "../pages/shared/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/shared/ResetPasswordPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { CadetDashboardPage } from "../pages/cadet/CadetDashboardPage";
import { NotFoundPage } from "../pages/shared/NotFoundPage";

export const AppRoutes = () => {
  const { isBootstrapping, isAuthenticated, user } = useAuth();

  if (isBootstrapping) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === "Admin" ? "/admin" : "/cadet"} /> : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute roles={["Admin"]} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["Cadet"]} />}>
        <Route path="/cadet" element={<CadetDashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

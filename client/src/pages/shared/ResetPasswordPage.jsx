import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { useAuth, withAsyncToast } from "../../context/AuthContext";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await withAsyncToast(resetPassword(token, password));
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password to restore account access.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          placeholder="New password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white shadow-glow">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      <Link to="/login" className="mt-4 inline-block text-sm text-brand-500">
        Back to login
      </Link>
    </AuthLayout>
  );
};

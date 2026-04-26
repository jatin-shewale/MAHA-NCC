import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { useAuth, withAsyncToast } from "../../context/AuthContext";

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await withAsyncToast(forgotPassword(email));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Recover access" subtitle="We’ll send a reset link to the registered email address.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white shadow-glow">
          {loading ? "Sending link..." : "Send Reset Link"}
        </button>
      </form>
      <Link to="/login" className="mt-4 inline-block text-sm text-brand-500">
        Back to login
      </Link>
    </AuthLayout>
  );
};

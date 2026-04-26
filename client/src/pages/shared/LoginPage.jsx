import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { useAuth, withAsyncToast } from "../../context/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await withAsyncToast(login(form));
      navigate(user.role === "Admin" ? "/admin" : "/cadet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to command" subtitle="Use your officer or cadet credentials to access the dashboard.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white shadow-glow transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/forgot-password" className="text-brand-500">
          Forgot password?
        </Link>
        <Link to="/register" className="text-brand-500">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
};

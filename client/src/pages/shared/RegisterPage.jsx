import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { useAuth, withAsyncToast } from "../../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    wing: "",
    rank: "",
    address: "",
    role: "Cadet"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await withAsyncToast(register(form));
      if (user) {
        navigate(user.role === "Admin" ? "/admin" : "/cadet");
      } else {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your NCC Pro account" subtitle="Cadet registrations require admin approval before access is granted.">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        {[
          ["name", "Full name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["wing", "Wing"],
          ["rank", "Rank"],
          ["address", "Address"]
        ].map(([key, label]) => (
          <input
            key={key}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            placeholder={label}
            type={key === "email" ? "email" : "text"}
            value={form[key]}
            onChange={(event) => setForm({ ...form, [key]: event.target.value })}
            required={["name", "email"].includes(key)}
          />
        ))}
        <input
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          minLength={8}
          title="Password must be at least 8 characters"
          required
        />
        <select
          value={form.role}
          onChange={(event) => setForm({ ...form, role: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option>Cadet</option>
          <option>Admin</option>
        </select>
        <button
          disabled={loading}
          className="md:col-span-2 rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white shadow-glow transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
        Already registered?{" "}
        <Link to="/login" className="text-brand-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

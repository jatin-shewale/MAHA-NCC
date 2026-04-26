import { Link } from "react-router-dom";

export const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-ink bg-mesh px-4 py-8 text-white">
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-strong relative overflow-hidden rounded-[36px] border-white/10 bg-slate-950/65 p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-transparent to-command/10" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-command">NCC Cadet Management System Pro</p>
          <h1 className="mt-6 max-w-md font-display text-4xl font-bold leading-tight">
            Premium command infrastructure for cadet operations.
          </h1>
          <p className="mt-5 max-w-xl text-sm text-slate-300">
            Secure approvals, analytics, camps, attendance, achievements, study resources, and cadet performance in one
            premium platform.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Animated KPI dashboards",
              "QR attendance workflow",
              "Monthly performance reports",
              "PWA-ready mobile experience"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="glass-strong rounded-[36px] p-8">
        <Link to="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-command">
          NCC Pro
        </Link>
        <h2 className="mt-6 font-display text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  </div>
);

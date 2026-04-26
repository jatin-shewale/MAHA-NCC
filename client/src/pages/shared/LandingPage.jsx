import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield, FiTrendingUp, FiUsers } from "react-icons/fi";
import { Button } from "../../components/common/Button";

export const LandingPage = () => (
  <div className="min-h-screen overflow-hidden bg-ink bg-mesh px-4 py-6 text-white">
    <div className="mx-auto max-w-7xl">
      <nav className="glass mb-12 flex items-center justify-between rounded-[28px] px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-command">NCC Pro</p>
          <h1 className="font-display text-lg font-bold">Cadet Management System</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-2xl px-4 py-2 text-sm font-medium text-white/80">
            Login
          </Link>
          <Button as={Link} to="/register">
            Launch Platform
          </Button>
        </div>
      </nav>

      <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.32em] text-command">
            Command-grade operational UX
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight md:text-6xl"
          >
            A premium command platform for NCC officers and cadets.
          </motion.h2>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Manage cadets, camps, approvals, attendance, digital ID cards, materials, rankings, reports, and
            notifications from one beautiful installable application.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button as={Link} to="/register" className="px-6">
              Create Account <FiArrowRight />
            </Button>
            <Button as={Link} to="/login" variant="secondary" className="px-6 text-white dark:text-white">
              Officer Sign In
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            { icon: FiUsers, title: "Cadet Lifecycle Control", copy: "Approvals, profile operations, rank and wing tracking." },
            { icon: FiTrendingUp, title: "Performance Intelligence", copy: "Live analytics, leaderboard insights, reports, and streak tracking." },
            { icon: FiShield, title: "Secure Operations", copy: "Protected access, audit visibility, alerts, and controlled file workflows." }
          ].map((item) => (
            <motion.div key={item.title} whileHover={{ y: -5 }} className="glass-strong rounded-[30px] p-6">
              <item.icon className="text-3xl text-command" />
              <h3 className="mt-4 font-display text-2xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

import { motion } from "framer-motion";
import CountUp from "./countup";

export const StatCard = ({ icon: Icon, label, value, accent = "from-brand-500 to-brand-300", description }) => (
  <motion.div whileHover={{ y: -4 }} className="glass-strong rounded-[28px] p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
        <h3 className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">
          <CountUp value={value} />
        </h3>
        {description ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-glow`}>
        <Icon className="text-xl" />
      </div>
    </div>
  </motion.div>
);

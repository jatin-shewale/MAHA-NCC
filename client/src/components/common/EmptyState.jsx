import { motion } from "framer-motion";

export const EmptyState = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass rounded-[28px] p-8 text-center"
  >
    {Icon ? <Icon className="mx-auto mb-4 text-4xl text-brand-400" /> : null}
    <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{description}</p>
  </motion.div>
);

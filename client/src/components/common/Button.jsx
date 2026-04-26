import { motion } from "framer-motion";
import { cn } from "../../lib/classNames";

export const Button = ({ className, children, variant = "primary", as: Component = "button", ...props }) => {
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-glow",
    secondary: "glass text-slate-900 dark:text-white hover:border-brand-300/40",
    subtle: "bg-slate-900/5 text-slate-700 hover:bg-slate-900/10 dark:bg-white/5 dark:text-slate-200"
  };

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Component
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
};

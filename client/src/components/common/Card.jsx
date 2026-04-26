import { motion } from "framer-motion";
import { cn } from "../../lib/classNames";

export const Card = ({ className, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={cn("glass-strong rounded-[28px] p-5", className)}
  >
    {children}
  </motion.div>
);

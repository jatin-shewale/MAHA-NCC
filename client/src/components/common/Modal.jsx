import { AnimatePresence, motion } from "framer-motion";

export const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen ? (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={(event) => event.stopPropagation()}
          className="glass-strong w-full max-w-2xl rounded-[32px] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="rounded-full bg-slate-900/5 px-3 py-1 text-sm dark:bg-white/5">
              Close
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const AppShell = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div>
          <Topbar onMenu={() => setIsMobileSidebarOpen(true)} />
          {children}
        </div>
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/50 p-4 backdrop-blur-md lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -30 }}
              animate={{ x: 0 }}
              exit={{ x: -30 }}
              className="h-full max-w-xs"
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar mobile onNavigate={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";

export const Topbar = ({ onMenu }) => {
  const { user, logout } = useAuth();

  return (
    <div className="glass sticky top-4 z-30 mb-6 flex items-center justify-between rounded-[28px] px-4 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="glass rounded-2xl p-3 text-slate-700 lg:hidden dark:text-slate-200">
          <FiMenu />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-command">Operational Overview</p>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <ThemeToggle />
        <button onClick={logout} className="glass rounded-2xl p-3 text-slate-700 dark:text-slate-200">
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

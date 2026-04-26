import { NavLink } from "react-router-dom";
import { FiAward, FiBookOpen, FiCalendar, FiClipboard, FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { cn } from "../../lib/classNames";
import { useAuth } from "../../context/AuthContext";

const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: FiHome },
  { label: "Cadets", to: "/admin#cadets", icon: FiUsers },
  { label: "Camps", to: "/admin#camps", icon: FiCalendar },
  { label: "Approvals", to: "/admin#approvals", icon: FiClipboard },
  { label: "Materials", to: "/admin#materials", icon: FiBookOpen }
];

const cadetLinks = [
  { label: "Dashboard", to: "/cadet", icon: FiHome },
  { label: "Camps", to: "/cadet#camps", icon: FiCalendar },
  { label: "Achievements", to: "/cadet#achievements", icon: FiAward },
  { label: "Materials", to: "/cadet#materials", icon: FiBookOpen },
  { label: "Profile", to: "/cadet#profile", icon: FiSettings }
];

export const Sidebar = ({ mobile = false, onNavigate }) => {
  const { user } = useAuth();
  const links = user?.role === "Admin" ? adminLinks : cadetLinks;

  return (
    <aside className={cn("glass-strong h-full rounded-[32px] p-5", mobile && "min-h-[70vh]")}>
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-command">NCC Pro</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">Command Center</h1>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-500 text-white shadow-glow"
                    : "text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/5"
                )
              }
            >
              <Icon className="text-lg" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

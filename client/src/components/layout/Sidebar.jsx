import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Share2, 
  Award, 
  BookOpen, 
  Tent, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Bell,
  Cpu
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const cadetLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Portfolio', icon: ShieldCheck, path: '/portfolio' },
    { name: 'Geo Attendance', icon: MapPin, path: '/attendance' },
    { name: 'Achievement Feed', icon: Share2, path: '/feed' },
    { name: 'Camps', icon: Tent, path: '/camps' },
    { name: 'AI Copilot', icon: Cpu, path: '/copilot' },
    { name: 'Study Portal', icon: BookOpen, path: '/study' },
    { name: 'Leaderboard', icon: Award, path: '/leaderboard' },
  ];

  const anoLinks = [
    { name: 'Command Center', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Cadet Control', icon: ShieldCheck, path: '/cadets' },
    { name: 'Moderation', icon: Bell, path: '/moderation' },
    { name: 'Camp Admin', icon: Tent, path: '/camp-admin' },
  ];

  const links = user?.role === 'ano' ? anoLinks : cadetLinks;

  return (
    <div className="w-64 min-h-screen bg-slate-950 border-r border-white/10 flex flex-col p-4 space-y-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-accent-gold rounded flex items-center justify-center">
          <ShieldCheck size={20} className="text-primary-navy" />
        </div>
        <span className="font-orbitron font-bold tracking-tight text-sm">CADETVERSE</span>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
              ${isActive 
                ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <link.icon size={20} />
            <span className="font-poppins text-sm font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 pt-4 border-t border-white/5">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={20} />
          <span className="font-poppins text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

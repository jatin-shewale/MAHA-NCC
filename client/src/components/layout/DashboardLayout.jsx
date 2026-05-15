import React from 'react';
import Sidebar from './Sidebar';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Bell, Search, User } from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-primary-navy">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-primary-navy/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-96">
            <Search size={16} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Command Nexus..." 
              className="bg-transparent border-none outline-none text-xs text-white w-full font-poppins"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-accent-gold transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-gold rounded-full border-2 border-primary-navy" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs font-bold text-white font-orbitron uppercase">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-poppins uppercase tracking-widest">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-accent-gold/20 border border-accent-gold/30 rounded-full flex items-center justify-center">
                <User size={20} className="text-accent-gold" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

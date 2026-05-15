import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Video, Download, CheckCircle, Clock, Book } from 'lucide-react';

const StudyPortal = () => {
  const materials = [
    { title: 'Drill Manual 2024', type: 'PDF', size: '2.4 MB', category: 'Common Subjects' },
    { title: 'Weapon Training: 0.22 Deluxe', type: 'Video', size: '15 mins', category: 'Specialized' },
    { title: 'NCC Organization & History', type: 'PDF', size: '1.1 MB', category: 'General' },
    { title: 'Field Craft & Battle Craft', type: 'PDF', size: '4.8 MB', category: 'Specialized' },
    { title: 'Map Reading Intelligence', type: 'Quiz', size: '20 Qs', category: 'Testing' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">Study & Training Intelligence</h1>
          <p className="text-xs text-slate-500 font-poppins uppercase tracking-widest">Authorized Training Materials | B & C Cert Prep</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-orbitron font-bold text-xs tracking-widest uppercase text-slate-400">Your Progress</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-orbitron text-slate-400">
                  <span>COMMON SUBJECTS</span>
                  <span>75%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-gold w-3/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-orbitron text-slate-400">
                  <span>SPECIALIZED SUBJECTS</span>
                  <span>40%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-green w-2/5" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-accent-gold/10 border border-accent-gold/20 rounded-xl">
              <p className="text-[10px] font-orbitron text-accent-gold uppercase mb-1">Upcoming Exam</p>
              <p className="text-xs font-bold text-white uppercase font-poppins">B-Certificate Theory</p>
              <div className="flex items-center gap-2 mt-2 text-slate-500">
                <Clock size={12} />
                <span className="text-[10px] font-poppins">12 Days Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex gap-4">
                {['All', 'Manuals', 'Videos', 'Quizzes'].map((tab) => (
                  <button key={tab} className={`text-[10px] font-orbitron uppercase tracking-widest ${tab === 'All' ? 'text-accent-gold' : 'text-slate-500 hover:text-white transition-colors'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {materials.map((m, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center border border-white/5">
                      {m.type === 'PDF' ? <FileText size={18} className="text-red-400" /> : 
                       m.type === 'Video' ? <Video size={18} className="text-blue-400" /> : 
                       <CheckCircle size={18} className="text-green-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white font-poppins group-hover:text-accent-gold transition-colors">{m.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-orbitron tracking-widest">{m.category} | {m.size}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-500 hover:text-accent-gold hover:bg-accent-gold/10 rounded-lg transition-all">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPortal;

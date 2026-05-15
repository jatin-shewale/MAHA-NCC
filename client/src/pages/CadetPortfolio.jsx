import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  MapPin, 
  Calendar, 
  Shield, 
  Droplet, 
  User, 
  FileText,
  QrCode,
  Download,
  CheckCircle,
  Loader2,
  TentTree
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CadetPortfolio = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      toast.error('Failed to sync dossier data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-accent-gold" size={40} />
      <p className="font-orbitron text-slate-400 uppercase tracking-widest text-xs">Accessing Dossier Database...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">Cadet Digital Dossier</h1>
          <p className="text-xs text-slate-500 font-poppins uppercase tracking-widest">Service Record | Identity Management</p>
        </div>
        <button className="military-btn flex items-center gap-2 text-sm px-4 py-2">
          EXPORT SERVICE BOOK <Download size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-accent-gold" />
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-accent-gold rounded-full blur-xl opacity-20 animate-pulse" />
              <div className="relative w-full h-full rounded-full border-2 border-accent-gold/50 p-1">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=0A192F&color=D4AF37&size=128`} 
                  className="w-full h-full rounded-full object-cover grayscale" 
                  alt="" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-orbitron font-bold text-white uppercase">{user.name}</h2>
              <p className="text-xs text-accent-gold font-orbitron tracking-widest uppercase">Rank: Cadet</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <p className="text-[10px] text-slate-500 font-orbitron uppercase">Unit</p>
                <p className="text-xs font-bold text-white uppercase">{user.unit || '1 MAH BN'}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <p className="text-[10px] text-slate-500 font-orbitron uppercase">Wing</p>
                <p className="text-xs font-bold text-white uppercase">ARMY</p>
              </div>
            </div>
          </div>

          {/* Digital ID Card */}
          <div className="bg-gradient-to-br from-primary-navy to-primary-green p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[10px] font-orbitron text-white leading-tight uppercase font-bold">National Cadet Corps</h4>
                  <p className="text-[8px] text-white/60 uppercase">Digital Identity Card</p>
                </div>
              </div>
              <div className="bg-white p-1 rounded-sm">
                <QRCodeSVG value={`CADET:${user.email}`} size={40} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-20 bg-slate-900 border border-white/20 rounded">
                   <img src={`https://ui-avatars.com/api/?name=${user.name}&background=020617&color=ffffff&size=80`} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[8px] text-white/50 uppercase">Full Name</p>
                    <p className="text-xs font-bold text-white uppercase">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/50 uppercase">Regiment No</p>
                    <p className="text-xs font-bold text-white uppercase">MAH/SD/24/1248</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[8px] text-white/50 uppercase">Blood Group</p>
                  <p className="text-xs font-bold text-white">B+ POSITIVE</p>
                </div>
                <div>
                  <p className="text-[8px] text-white/50 uppercase">Valid Thru</p>
                  <p className="text-xs font-bold text-white">MAR 2027</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 py-2 bg-black/20 rounded-lg">
              <CheckCircle size={12} className="text-green-500" />
              <span className="text-[9px] font-orbitron text-white/80 tracking-widest uppercase">Battalion Verified</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats & Service History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 space-y-8">
            <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase text-slate-400 flex items-center gap-2">
              <FileText size={16} /> Operational Service history
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-orbitron text-accent-gold uppercase tracking-widest mb-4">Milestones</p>
                  <div className="space-y-4">
                    {[
                      { label: 'Enrollment Date', value: '15 AUG 2024' },
                      { label: 'B-Certificate Status', value: 'APPEARED' },
                      { label: 'C-Certificate Status', value: 'PENDING' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-xs text-slate-500 font-poppins">{item.label}</span>
                        <span className="text-xs text-white font-orbitron">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-orbitron text-accent-gold uppercase tracking-widest mb-4">Camp Deployments</p>
                  <div className="space-y-3">
                    {[
                      { name: 'CATC-I 2024', loc: 'Pune HQ', date: 'SEP 2024' },
                      { name: 'ATC-II 2025', loc: 'Ahmednagar', date: 'JAN 2025' },
                    ].map((camp, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-4">
                        <TentTree size={16} className="text-accent-gold" />
                        <div>
                          <p className="text-xs font-bold text-white">{camp.name}</p>
                          <p className="text-[10px] text-slate-500">{camp.loc} | {camp.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-orbitron text-accent-gold uppercase tracking-widest mb-4">Physical Measurements</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Height', value: '178 cm' },
                      { label: 'Weight', value: '72 kg' },
                      { label: 'Chest', value: '92 cm' },
                      { label: 'Uniform Size', value: 'Large (42)' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase">{item.label}</p>
                        <p className="text-xs font-bold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-accent-gold/5 border border-accent-gold/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="text-accent-gold" size={24} />
                    <p className="text-sm font-orbitron font-bold text-white uppercase">Gallantry & Merits</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="text-xs text-slate-300 font-poppins flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                      Best Cadet - Inter-Unit Drill Competition 2024
                    </li>
                    <li className="text-xs text-slate-300 font-poppins flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                      Alpha Grade in Weapon Training (WT)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadetPortfolio;

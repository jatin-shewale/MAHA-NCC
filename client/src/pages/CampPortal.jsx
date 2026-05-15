import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tent, MapPin, Calendar, Users, ChevronRight, Info, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CampPortal = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  const fetchCamps = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/camps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCamps(res.data);
    } catch (err) {
      toast.error('Failed to sync camp data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCamps(); }, []);

  const handleApply = async (campId) => {
    setApplying(campId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/camps/apply`, { campId, remarks: 'Applied via Command Nexus' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Application submitted. Awaiting battalion approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed.');
    } finally {
      setApplying(null);
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-accent-gold" size={40} />
      <p className="font-orbitron text-slate-400 uppercase tracking-widest text-xs">Scanning Unit Deployments...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">Deployment & Camp Portal</h1>
          <p className="text-xs text-slate-500 font-poppins uppercase tracking-widest">Available Operations | Operational Capacity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {camps.map((camp) => (
          <motion.div 
            key={camp._id}
            whileHover={{ y: -5 }}
            className="glass-card flex flex-col overflow-hidden group"
          >
            <div className="h-32 bg-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-military-gradient opacity-20" />
              <Tent className="text-accent-gold opacity-40 group-hover:scale-110 transition-transform" size={60} />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-accent-gold/20 border border-accent-gold/30 rounded-full text-[9px] font-orbitron text-accent-gold uppercase tracking-widest">
                  {camp.type}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1">
              <h3 className="text-lg font-orbitron font-bold text-white uppercase leading-tight group-hover:text-accent-gold transition-colors">
                {camp.name}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={14} className="text-accent-gold" />
                  <span className="text-xs font-poppins">{camp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} className="text-accent-gold" />
                  <span className="text-xs font-poppins">
                    {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} className="text-accent-gold" />
                  <span className="text-xs font-poppins">Capacity: {camp.capacity || 150} Cadets</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-poppins line-clamp-2">
                {camp.description || 'Specialized training camp for leadership development and drill proficiency.'}
              </p>
            </div>

            <div className="p-6 pt-0">
              <button 
                onClick={() => handleApply(camp._id)}
                disabled={applying === camp._id}
                className="w-full military-btn py-3 text-xs flex items-center justify-center gap-2"
              >
                {applying === camp._id ? <Loader2 className="animate-spin" /> : (
                  <>
                    INITIALIZE APPLICATION <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {camps.length === 0 && (
        <div className="glass-card p-20 flex flex-col items-center justify-center space-y-4 border-dashed border-white/5">
          <Info size={40} className="text-slate-700" />
          <p className="font-orbitron text-slate-500 uppercase tracking-widest text-sm text-center">
            No active camp deployments found for your unit. <br /> Check back for CATC/RDC updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default CampPortal;

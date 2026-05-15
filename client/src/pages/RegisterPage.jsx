import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, User, MapPin, ChevronRight, Loader2, Award, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import AnimatedCommandBackground from '../components/Background/AnimatedCommandBackground';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cadet',
    unit: '',
    enrollmentNo: '',
    wing: 'Army',
  });
  
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      toast.success('Registration Successful. Welcome to CadetVerse AI.');
      navigate('/dashboard');
    } else {
      toast.error('Registration Failed. Check your details.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AnimatedCommandBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-card p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield size={120} className="text-accent-gold" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-orbitron font-bold tracking-tight text-white">UNIT ENLISTMENT</h1>
            <p className="text-slate-400 font-poppins text-sm uppercase tracking-widest">Create your digital military footprint</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input name="name" type="text" required onChange={handleChange} className="auth-input" placeholder="Cdt. John Doe" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input name="email" type="email" required onChange={handleChange} className="auth-input" placeholder="john@ncc.gov.in" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest ml-1">Secret Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input name="password" type="password" required onChange={handleChange} className="auth-input" placeholder="••••••••" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest ml-1">Unit Designation</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input name="unit" type="text" required onChange={handleChange} className="auth-input" placeholder="1 Maharashtra Bn" />
                </div>
              </div>
            </div>

            {/* Role Specific Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest ml-1">Command Role</label>
                <select name="role" onChange={handleChange} className="auth-input appearance-none">
                  <option value="cadet">Cadet (Operational)</option>
                  <option value="ano">ANO (Commanding)</option>
                </select>
              </div>

              {formData.role === 'cadet' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest ml-1">Enrollment ID</label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input name="enrollmentNo" type="text" required onChange={handleChange} className="auth-input" placeholder="MAH/SDA/24/..." />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest ml-1">Wing Selection</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Army', 'Navy', 'Air'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setFormData({ ...formData, wing: w })}
                          className={`py-2 text-[10px] font-orbitron rounded border ${formData.wing === w ? 'border-accent-gold bg-accent-gold/20 text-accent-gold' : 'border-white/10 text-slate-400'}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full military-btn flex items-center justify-center gap-2 group"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      ENLIST NOW <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-slate-500 text-sm font-poppins">
              Already in the system? <Link to="/login" className="text-accent-gold hover:underline">Access Terminal</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

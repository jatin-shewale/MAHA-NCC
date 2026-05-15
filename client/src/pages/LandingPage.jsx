import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Share2, Award, BookOpen, Cpu, Bell, ChevronRight } from 'lucide-react';
import AnimatedCommandBackground from '../components/Background/AnimatedCommandBackground';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen text-white font-inter overflow-x-hidden">
      <AnimatedCommandBackground />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-primary-navy/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-gold rounded-lg flex items-center justify-center">
              <Shield className="text-primary-navy" />
            </div>
            <span className="font-orbitron text-xl font-bold tracking-wider">CADETVERSE AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-poppins text-sm uppercase tracking-widest text-slate-300">
            <a href="#features" className="hover:text-accent-gold transition-colors">Features</a>
            <a href="#mission" className="hover:text-accent-gold transition-colors">Mission</a>
            <Link to="/login" className="px-6 py-2 border border-accent-gold/50 text-accent-gold hover:bg-accent-gold hover:text-primary-navy transition-all rounded-md">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-accent-gold text-primary-navy hover:bg-white transition-all rounded-md font-bold">
              Join Nexus
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-block px-4 py-1 bg-accent-gold/10 border border-accent-gold/30 rounded-full text-accent-gold text-xs font-orbitron tracking-widest uppercase">
              Operational Digital Ecosystem
            </div>
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold leading-tight">
              The Next Gen <br />
              <span className="text-accent-gold">NCC Command</span> Nexus
            </h1>
            <p className="text-lg text-slate-400 font-poppins leading-relaxed max-w-xl">
              Elevating the National Cadet Corps with Geo-Intelligent Attendance, 
              Social Achievement Networks, and AI-Driven Training Analytics.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-accent-gold text-primary-navy rounded-md font-bold flex items-center gap-2 hover:scale-105 transition-transform group">
                GET STARTED <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-white/20 rounded-md font-bold hover:bg-white/5 transition-all">
                VIEW CAPABILITIES
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Using a placeholder for the cadet visual */}
              <img 
                src="https://images.unsplash.com/photo-1590218126487-d63eb7ed6527?auto=format&fit=crop&q=80&w=1200" 
                alt="Cadet Command Center" 
                className="w-full grayscale contrast-125 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-navy via-transparent to-transparent" />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-primary-green/90 backdrop-blur-xl p-4 rounded-xl border border-white/20 z-20 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60">Live Parade Units</p>
                  <p className="text-xl font-orbitron font-bold">1,248</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-accent-gold font-orbitron tracking-widest uppercase text-sm">Capabilities</h2>
            <h3 className="text-4xl font-bold font-orbitron">Digital Superiority for Cadets</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Geo-Attendance", desc: "GPS-fenced parade validation with anti-spoofing protocols." },
              { icon: Share2, title: "Achievement Network", desc: "Social ecosystem to showcase certifications and camp milestones." },
              { icon: Cpu, title: "Cadet Copilot", desc: "AI-driven assistant for training materials and NCC circulars." },
              { icon: Award, title: "Leaderboard", desc: "Gamified ranking based on attendance, drill, and firing scores." },
              { icon: BookOpen, title: "Dossier Portal", desc: "Unified digital profile with service history and QR verification." },
              { icon: Bell, title: "Command Alerts", desc: "Real-time notifications for camp calls and unit notices." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-accent-gold/50 transition-all group"
              >
                <div className="w-14 h-14 bg-accent-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-gold/20 transition-colors">
                  <feature.icon className="text-accent-gold" size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 font-orbitron">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed font-poppins">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

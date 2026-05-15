import React from 'react';
import { motion } from 'framer-motion';

const RadarSweep = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-20">
      <div className="relative w-[800px] h-[800px] rounded-full border border-primary-green/30">
        {/* Rings */}
        <div className="absolute inset-0 rounded-full border border-primary-green/20 scale-[0.75]" />
        <div className="absolute inset-0 rounded-full border border-primary-green/10 scale-[0.5]" />
        <div className="absolute inset-0 rounded-full border border-primary-green/5 scale-[0.25]" />
        
        {/* Sweep Beam */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left bg-radar-conic"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Blinking Targets */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent-gold rounded-full shadow-[0_0_10px_#D4AF37]"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
      </div>
    </div>
  );
};

export default RadarSweep;

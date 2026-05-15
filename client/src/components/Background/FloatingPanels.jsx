import React from 'react';
import { motion } from 'framer-motion';

const FloatingPanels = () => {
  const panels = [
    { x: '10%', y: '20%', w: 120, h: 80, delay: 0 },
    { x: '80%', y: '15%', w: 150, h: 100, delay: 1 },
    { x: '15%', y: '70%', w: 100, h: 120, delay: 2 },
    { x: '75%', y: '65%', w: 140, h: 90, delay: 1.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {panels.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-lg border border-white/10 bg-white/5 backdrop-blur-md"
          style={{
            left: p.x,
            top: p.y,
            width: p.w,
            height: p.h,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {/* Subtle UI indicators inside panels */}
          <div className="p-2 space-y-1">
            <div className="h-1 w-1/2 bg-white/20 rounded" />
            <div className="h-1 w-3/4 bg-white/10 rounded" />
            <div className="h-1 w-2/3 bg-white/10 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingPanels;

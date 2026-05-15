import React from 'react';
import ParticleField from './ParticleField';
import RadarSweep from './RadarSweep';
import TacticalGrid from './TacticalGrid';
import GeoNetwork from './GeoNetwork';
import FloatingPanels from './FloatingPanels';

const AnimatedCommandBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-primary-navy overflow-hidden">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-military-gradient opacity-40" />
      
      {/* Animated Layers */}
      <TacticalGrid />
      <GeoNetwork />
      <ParticleField />
      <RadarSweep />
      <FloatingPanels />
      
      {/* Vignette & Noise Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,25,47,0.4)_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
};

export default AnimatedCommandBackground;

import React from 'react';

const TacticalGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {/* 3D Perspective Grid */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[60%] origin-bottom"
        style={{
          perspective: '1000px',
          transform: 'rotateX(60deg)',
        }}
      >
        <div 
          className="w-full h-[200%] bg-[linear-gradient(to_right,rgba(31,111,80,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(31,111,80,0.1)_1px,transparent_1px)]"
          style={{
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, transparent, black 50%)',
          }}
        />
      </div>

      {/* Top Subtle Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(31,111,80,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(31,111,80,0.05)_1px,transparent_1px)]"
        style={{ backgroundSize: '100px 100px' }}
      />
    </div>
  );
};

export default TacticalGrid;

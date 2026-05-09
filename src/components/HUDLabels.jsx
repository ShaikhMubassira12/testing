import React from 'react';

const HUDLabels = () => {
  return (
    <>
      <div className="hud-label top-left">
        <span className="pulse-dot"></span>NEURAL CORE / ACTIVE
      </div>
      <div className="hud-label top-right">v2.4.1 · STABLE</div>
      <div className="hud-label bottom-left">AUTONOMOUS · REASONING</div>
      <div className="hud-label bottom-right">
        <span>LIVE</span>
        <span className="bar">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
    </>
  );
};

export default HUDLabels;

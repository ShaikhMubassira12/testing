import React from 'react';

const Background = () => {
  return (
    <>
      <div className="grid-bg" aria-hidden="true"></div>
      <div className="glow glow-1" aria-hidden="true"></div>
      <div className="glow glow-2" aria-hidden="true"></div>

      <div className="brand-bg" aria-hidden="true">
        <div className="brand-bg-text" data-text="KINNOVANCE">KINNOVANCE</div>
        <div className="brand-bg-sub">AUTONOMOUS · INTELLIGENT · ADAPTIVE</div>
      </div>

      <div className="noise" aria-hidden="true"></div>
    </>
  );
};

export default Background;

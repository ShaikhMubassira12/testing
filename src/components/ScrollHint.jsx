import React from 'react';

const ScrollHint = () => {
  return (
    <div className="scroll-hint" data-anim="fade">
      <span>Scroll</span>
      <div className="scroll-line">
        <div className="scroll-dot"></div>
      </div>
    </div>
  );
};

export default ScrollHint;

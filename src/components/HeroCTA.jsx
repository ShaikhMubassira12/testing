import React from 'react';

const HeroCTA = () => {
  return (
    <div className="hero-ctas" data-anim="fade">
      <a href="#" className="btn-primary">
        <span>Explore Platform</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <a href="#" className="btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
        <span>View Demo</span>
      </a>
    </div>
  );
};

export default HeroCTA;

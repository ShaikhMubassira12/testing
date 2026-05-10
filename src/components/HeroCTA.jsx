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
      <a href="/request-demo" className="btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M8 7h8M8 12h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span>Request Demo</span>
      </a>
    </div>
  );
};

export default HeroCTA;

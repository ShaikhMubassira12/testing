import React from 'react';

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="/" className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="4" stroke="url(#g1)" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="9" stroke="url(#g1)" strokeWidth="1" strokeDasharray="2 3" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0" stopColor="#00D1FF" />
                  <stop offset="1" stopColor="#6C5CE7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="brand-name">Kinnovance<span className="brand-dot">.</span>AI</span>
        </a>

        <ul className="nav-links">
          <li><a href="#">Platform</a></li>
          <li><a href="#">Agents</a></li>
          <li><a href="#">Research</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Docs</a></li>
        </ul>

        <div className="nav-cta">
          <a href="#" className="btn-ghost">Sign in</a>
          <a href="#" className="btn-primary btn-sm">Get Access</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

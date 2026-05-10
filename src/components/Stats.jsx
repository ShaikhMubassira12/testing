import React from 'react';

const Stats = () => {
  return (
    <div className="stats" data-anim="fade">
      <div className="stat">
        <div className="stat-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 12.5l2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="stat-body">
          <div className="stat-num">99.8<span>%</span></div>
          <div className="stat-label">Task Accuracy</div>
          <div className="stat-sub">Validated across production workflows</div>
        </div>
      </div>
      <div className="stat">
        <div className="stat-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <rect x="8.5" y="13.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 10.5v2.5c0 .6.4 1 1 1h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="stat-body">
          <div className="stat-num">2.4<span>M+</span></div>
          <div className="stat-label">Agents Deployed</div>
          <div className="stat-sub">Scaled across enterprise teams</div>
        </div>
      </div>
      <div className="stat">
        <div className="stat-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 3h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="stat-body">
          <div className="stat-num">&lt;40<span>ms</span></div>
          <div className="stat-label">Reasoning Latency</div>
          <div className="stat-sub">Realtime decision loops at scale</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;

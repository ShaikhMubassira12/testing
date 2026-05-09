import React from 'react';

const Stats = () => {
  return (
    <div className="stats" data-anim="fade">
      <div className="stat">
        <div className="stat-num">99.8<span>%</span></div>
        <div className="stat-label">Task Accuracy</div>
      </div>
      <div className="stat-sep"></div>
      <div className="stat">
        <div className="stat-num">2.4<span>M+</span></div>
        <div className="stat-label">Agents Deployed</div>
      </div>
      <div className="stat-sep"></div>
      <div className="stat">
        <div className="stat-num">&lt;40<span>ms</span></div>
        <div className="stat-label">Reasoning Latency</div>
      </div>
    </div>
  );
};

export default Stats;

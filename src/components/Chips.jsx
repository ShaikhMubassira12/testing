import React from 'react';

const Chips = () => {
  const chips = [
    'Agentic AI',
    'Multi-Agent Systems',
    'Autonomous Workflows',
    'AI Automation',
  ];

  return (
    <div className="chips" data-anim="chips">
      {chips.map((chip, index) => (
        <span key={index} className="chip">{chip}</span>
      ))}
    </div>
  );
};

export default Chips;

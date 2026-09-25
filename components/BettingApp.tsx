import React from 'react';

interface BettingAppProps {
  title?: string;
}

const BettingApp: React.FC<BettingAppProps> = ({ title = 'Betting App' }) => {
  return (
    <div className="betting-app">
      <h1>{title}</h1>
      <p>Welcome to GOALIX Betting Platform</p>
    </div>
  );
};

export default BettingApp;

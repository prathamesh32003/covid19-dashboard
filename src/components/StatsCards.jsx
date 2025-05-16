import React from 'react';

const StatsCards = ({ totals }) => (
  <div className="stats-grid">
    <div className="stat-card cases">
      <h3>Cases</h3>
      <p>{totals.cases.toLocaleString()}</p>
    </div>
    <div className="stat-card recovered">
      <h3>Recovered</h3>
      <p>{totals.recovered.toLocaleString()}</p>
    </div>
    <div className="stat-card deaths">
      <h3>Deaths</h3>
      <p>{totals.deaths.toLocaleString()}</p>
    </div>
  </div>
);

export default StatsCards;
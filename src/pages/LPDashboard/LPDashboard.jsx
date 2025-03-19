// src/pages/LPDashboard/LPDashboard.js
// import React from "react";
// import Navbar from "../../components/Navbar/Navbar";

// const LPDashboard = () => {
//   return (
//     <>
//       <Navbar />
//       <div className="main-content">
//         <h1 className="placeholder-content">LP Dashboard</h1>
//       </div>
//     </>
//   );
// };

// export default LPDashboard;

import React, { useState } from 'react';
import './LPDashboard.css';
import Navbar from '../../components/Navbar/Navbar';
import { lpDashboardData } from '../../data/LPDashboardData';

const LPDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedChain, setSelectedChain] = useState('All Chains');
  
  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };
  
  const handleChainChange = (e) => {
    setSelectedChain(e.target.value);
  };
  
  // Filter pools based on selected chain
  const filteredPools = selectedChain === 'All Chains' 
    ? lpDashboardData.pools 
    : lpDashboardData.pools.filter(pool => pool.chain === selectedChain);

  return (
    <>
    <Navbar/>
    
    <div className="lp-dashboard">
      <div className="dashboard-header">
        <h1>Liquidity Provider Dashboard</h1>
        <div className="wallet-summary">
          <div className="wallet-balance">
            <span className="balance-label">Wallet Balance</span>
            <span className="balance-value">$42,580.25</span>
          </div>
          <button className="gradient-button">
            <span>+</span> Add Liquidity
          </button>
        </div>
      </div>
      
      <div className="dashboard-overview">
        <div className="overview-card total-value">
          <h3>Total Value Locked</h3>
          <div className="value-amount">${lpDashboardData.overview.tvl}</div>
          <div className="value-change positive">
            +{lpDashboardData.overview.tvlChange}% from last week
          </div>
        </div>
        
        <div className="overview-card total-earnings">
          <h3>Total Earnings</h3>
          <div className="value-amount">${lpDashboardData.overview.earnings}</div>
          <div className="value-change positive">
            +{lpDashboardData.overview.earningsChange}% from last week
          </div>
        </div>
        
        <div className="overview-card average-apy">
          <h3>Average APY</h3>
          <div className="value-amount">{lpDashboardData.overview.avgApy}%</div>
          <div className="value-change negative">
            -{lpDashboardData.overview.apyChange}% from last week
          </div>
        </div>
        
        <div className="overview-card impermanent-loss">
          <h3>Impermanent Loss</h3>
          <div className="value-amount">{lpDashboardData.overview.impermanentLoss}%</div>
          <div className="value-change positive">
            +{lpDashboardData.overview.ilChange}% from last week
          </div>
        </div>
      </div>
      
      <div className="performance-chart">
        <div className="chart-header">
          <h2>Performance Over Time</h2>
          <div className="chart-controls">
            <div className="timeframe-selector">
              <button 
                className={selectedTimeframe === '24h' ? 'active' : ''} 
                onClick={() => handleTimeframeChange('24h')}
              >
                24H
              </button>
              <button 
                className={selectedTimeframe === '7d' ? 'active' : ''} 
                onClick={() => handleTimeframeChange('7d')}
              >
                7D
              </button>
              <button 
                className={selectedTimeframe === '30d' ? 'active' : ''} 
                onClick={() => handleTimeframeChange('30d')}
              >
                30D
              </button>
              <button 
                className={selectedTimeframe === '90d' ? 'active' : ''} 
                onClick={() => handleTimeframeChange('90d')}
              >
                90D
              </button>
              <button 
                className={selectedTimeframe === 'all' ? 'active' : ''} 
                onClick={() => handleTimeframeChange('all')}
              >
                ALL
              </button>
            </div>
          </div>
        </div>
        
        <div className="chart-placeholder">
          {/* In a real app, this would be a chart component */}
          <div className="mock-chart">
            <div className="chart-line"></div>
            <div className="chart-labels">
              <span>Mar 10</span>
              <span>Mar 12</span>
              <span>Mar 14</span>
              <span>Mar 16</span>
              <span>Mar 18</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pools-section">
        <div className="section-header">
          <h2>Your Liquidity Pools</h2>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Chain:</label>
              <select value={selectedChain} onChange={handleChainChange}>
                <option value="All Chains">All Chains</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Arbitrum">Arbitrum</option>
                <option value="Optimism">Optimism</option>
                <option value="Base">Base</option>
                <option value="Solana">Solana</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="pools-table-container">
          <table className="pools-table">
            <thead>
              <tr>
                <th>Pool</th>
                <th>Chain</th>
                <th>Protocol</th>
                <th>Value</th>
                <th>APY</th>
                <th>IL</th>
                <th>Earnings (7d)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPools.map((pool) => (
                <tr key={pool.id}>
                  <td className="pool-name">
                    <div className="token-icons">
                      <div className="token-icon">{pool.token1.substring(0, 1)}</div>
                      <div className="token-icon">{pool.token2.substring(0, 1)}</div>
                    </div>
                    <span>{pool.token1}/{pool.token2}</span>
                  </td>
                  <td>
                    <div className="chain-badge">{pool.chain}</div>
                  </td>
                  <td>{pool.protocol}</td>
                  <td>${pool.value}</td>
                  <td className="apy-cell">{pool.apy}%</td>
                  <td className={pool.il > 2 ? 'negative' : ''}>{pool.il}%</td>
                  <td className={parseFloat(pool.earnings) > 0 ? 'positive' : 'negative'}>
                    {pool.earnings.startsWith('+') ? pool.earnings : pool.earnings}
                  </td>
                  <td>
                    <div className="pool-actions">
                      <button className="action-button">Manage</button>
                      <button className="action-button remove-button">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="rewards-section">
        <h2>Rewards & Incentives</h2>
        <div className="rewards-grid">
          {lpDashboardData.rewards.map((reward, index) => (
            <div className="reward-card" key={index}>
              <div className="reward-header">
                <div className="reward-protocol">{reward.protocol}</div>
                <div className="reward-chain">{reward.chain}</div>
              </div>
              <h3>{reward.name}</h3>
              <div className="reward-details">
                <div className="reward-detail">
                  <span className="detail-label">Reward Rate</span>
                  <span className="detail-value">{reward.rate} / day</span>
                </div>
                <div className="reward-detail">
                  <span className="detail-label">Claimable</span>
                  <span className="detail-value">{reward.claimable}</span>
                </div>
                <div className="reward-detail">
                  <span className="detail-label">Value</span>
                  <span className="detail-value">${reward.value}</span>
                </div>
              </div>
              <button className="claim-button">Claim Rewards</button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default LPDashboard;

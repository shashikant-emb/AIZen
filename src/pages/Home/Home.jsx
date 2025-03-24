// import React from "react";
// import Navbar from "../../components/Navbar/Navbar";

// const Home = () => {
//     return (
//       <>
//         <Navbar />
//         <div className="main-content">
//           <h1 className="placeholder-content">Home Page</h1>
//         </div>
//       </>
//     );
//   };
  
//   export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';

const Home= () => {
  return (
    <>
    <Navbar/>
   
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Algorithmic Trading Agents for DeFi</h1>
          <p>Deploy intelligent trading strategies across multiple chains with minimal impermanent loss</p>
          <div className="hero-buttons">
            <Link to="/marketplace" className="gradient-button">
              Explore Marketplace
            </Link>
            <Link to="/agent-builder" className="outline-button">
              Build Your Agent
            </Link>
          </div>
        </div>
        <div className="hero-image">
          {/* <img src="/placeholder.svg?height=400&width=500" alt="AIZen Platform" /> */}
          <img src="https://imgs.search.brave.com/GXPQ2KIJX2XU5Zo9OaqfO8rYqqcEuZDR5H7nBy9Y5So/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmFj/dGlvbmFpLnh5ei9f/bmV4dC9zdGF0aWMv/bWVkaWEvRGF0YVNw/YWNlc0JvdHRvbUdy/YWRpZW50LjUwODNh/NWUxLnN2Zw?height=400&width=500" alt="AIZen Platform" />
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-item">
          <h2>$42.8M</h2>
          <p>Total Value Locked</p>
        </div>
        <div className="stat-item">
          <h2>248</h2>
          <p>Active Agents</p>
        </div>
        <div className="stat-item">
          <h2>+18.4%</h2>
          <p>Average Monthly Return</p>
        </div>
        <div className="stat-item">
          <h2>5</h2>
          <p>Supported Chains</p>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Agents</h3>
            <p>Leverage advanced algorithms to optimize trading strategies and maximize returns.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Multi-Chain Support</h3>
            <p>Deploy your strategies across Ethereum, Arbitrum, Base, Optimism, and Solana.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Analytics</h3>
            <p>Monitor performance with comprehensive dashboards and detailed metrics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Custom Agent Builder</h3>
            <p>Create and customize your own trading agents with our intuitive builder interface.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Risk Management</h3>
            <p>Implement sophisticated risk controls to protect your assets during market volatility.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Yield Optimization</h3>
            <p>Automatically rebalance your portfolio to capture the highest yields across DeFi.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choose a Strategy</h3>
            <p>Browse the marketplace for pre-built strategies or create your own custom agent.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Configure Parameters</h3>
            <p>Set your risk tolerance, rebalance frequency, and other key parameters.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Deploy Your Agent</h3>
            <p>Connect your wallet and deploy your agent to start trading automatically.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Monitor & Optimize</h3>
            <p>Track performance and make adjustments to maximize your returns.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"AIZen has completely transformed my DeFi strategy. My portfolio has seen a 22% increase since I started using their agents."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <h4>John Doe</h4>
                <p>DeFi Investor</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"The custom agent builder is incredibly intuitive. I was able to create and deploy my own strategy in less than 30 minutes."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">AS</div>
              <div className="author-info">
                <h4>Alice Smith</h4>
                <p>Crypto Trader</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"The multi-chain support is a game-changer. I can now optimize my liquidity across different ecosystems from a single dashboard."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">RJ</div>
              <div className="author-info">
                <h4>Robert Johnson</h4>
                <p>Protocol Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Optimize Your DeFi Strategy?</h2>
          <p>Join thousands of users who are already maximizing their returns with AIZen.</p>
          <Link to="/marketplace" className="gradient-button">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;

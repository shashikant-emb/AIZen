// src/pages/About/About.js
// import React from "react";
// import Navbar from "../../components/Navbar/Navbar";

// const About = () => {
//   return (
//     <>
//       <Navbar />
//       <div className="main-content">
//         <h1 className="placeholder-content">About Page</h1>
//       </div>
//     </>
//   );
// };
// export default About;

import  React from "react"
import { Link } from "react-router-dom"
import "./About.css"
import Navbar from "../../components/Navbar/Navbar"

const About = () => {
  return (
    <>
    <Navbar />
    
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About AIZen</h1>
          <p>
            AIZen is a decentralized platform that leverages artificial intelligence to create, deploy, and manage
            automated trading strategies for DeFi liquidity providers.
          </p>
        </div>
      </section>

      <section className="about-mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            Our mission is to democratize algorithmic trading in DeFi by providing sophisticated trading strategies that
            were previously only available to institutional investors. We believe that by combining AI with blockchain
            technology, we can create a more efficient, transparent, and accessible financial ecosystem for everyone.
          </p>
        </div>
      </section>

      <section className="about-technology">
        <h2>Our Technology</h2>
        <div className="technology-grid">
          <div className="technology-card">
            <div className="technology-icon">🧠</div>
            <h3>AI-Powered Strategies</h3>
            <p>
              Our platform uses advanced machine learning algorithms to analyze market data, identify patterns, and
              execute optimal trading strategies across multiple DeFi protocols.
            </p>
          </div>
          <div className="technology-card">
            <div className="technology-icon">⛓️</div>
            <h3>Multi-Chain Support</h3>
            <p>
              AIZen operates across multiple blockchain networks, including Ethereum, Arbitrum, Optimism, Base, and
              Solana, allowing users to access liquidity and opportunities across the entire DeFi ecosystem.
            </p>
          </div>
          <div className="technology-card">
            <div className="technology-icon">🔒</div>
            <h3>Non-Custodial Architecture</h3>
            <p>
              Our platform is fully non-custodial, meaning users always maintain control of their funds. Smart contracts
              execute trades automatically based on the selected strategy.
            </p>
          </div>
          <div className="technology-card">
            <div className="technology-icon">📊</div>
            <h3>Advanced Analytics</h3>
            <p>
              Comprehensive dashboards provide real-time insights into performance, impermanent loss, yield generation,
              and other key metrics to help users make informed decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="about-how-it-works">
        <h2>How AIZen Works</h2>
        <div className="how-it-works-container">
          <div className="how-it-works-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Strategy Selection</h3>
              <p>
                Users can browse the marketplace to find pre-built strategies or create custom strategies using our
                intuitive Agent Builder interface.
              </p>
            </div>
          </div>
          <div className="how-it-works-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Parameter Configuration</h3>
              <p>
                Customize risk parameters, rebalancing frequency, target pools, and other settings to align with your
                investment goals.
              </p>
            </div>
          </div>
          <div className="how-it-works-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Deployment</h3>
              <p>
                Connect your wallet and deploy your strategy. Our smart contracts will automatically execute trades
                based on the selected parameters.
              </p>
            </div>
          </div>
          <div className="how-it-works-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Monitoring & Optimization</h3>
              <p>
                Track performance in real-time through our dashboard and make adjustments as needed to optimize returns
                and minimize risks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">JS</div>
            <h3>John Smith</h3>
            <p className="member-title">CEO & Co-Founder</p>
            <p className="member-bio">
              Former quantitative trader with 10+ years of experience at leading hedge funds. PhD in Financial
              Engineering from MIT.
            </p>
          </div>
          <div className="team-member">
            <div className="member-avatar">EW</div>
            <h3>Emily Wong</h3>
            <p className="member-title">CTO & Co-Founder</p>
            <p className="member-bio">
              Blockchain developer and AI researcher with contributions to multiple DeFi protocols. Previously led
              engineering at a top DEX.
            </p>
          </div>
          <div className="team-member">
            <div className="member-avatar">MJ</div>
            <h3>Michael Johnson</h3>
            <p className="member-title">Head of Research</p>
            <p className="member-bio">
              Expert in machine learning and algorithmic trading. Published author on DeFi liquidity optimization and
              impermanent loss mitigation.
            </p>
          </div>
          <div className="team-member">
            <div className="member-avatar">SR</div>
            <h3>Sarah Rodriguez</h3>
            <p className="member-title">Head of Product</p>
            <p className="member-bio">
              Product leader with experience at major fintech companies. Passionate about creating intuitive user
              experiences for complex financial products.
            </p>
          </div>
        </div>
      </section>

      <section className="about-investors">
        <h2>Backed By</h2>
        <div className="investors-grid">
          <div className="investor-logo">Paradigm</div>
          <div className="investor-logo">a16z</div>
          <div className="investor-logo">Pantera Capital</div>
          <div className="investor-logo">Jump Crypto</div>
          <div className="investor-logo">Coinbase Ventures</div>
          <div className="investor-logo">Polychain</div>
        </div>
      </section>

      <section className="about-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>How does AIZen make money?</h3>
            <p>
              AIZen charges a small performance fee (2%) on profits generated by the strategies. There are no
              management fees or upfront costs to use the platform.
            </p>
          </div>
          <div className="faq-item">
            <h3>Is AIZen secure?</h3>
            <p>
              Yes, all our smart contracts have been audited by leading security firms. Additionally, our non-custodial
              architecture means users always maintain control of their funds.
            </p>
          </div>
          <div className="faq-item">
            <h3>What chains does AIZen support?</h3>
            <p>
              Currently, we support Ethereum, Arbitrum, Optimism, Base, and Solana. We plan to add support for
              additional chains based on community demand.
            </p>
          </div>
          <div className="faq-item">
            <h3>How are impermanent losses managed?</h3>
            <p>
              Our strategies use sophisticated algorithms to monitor and mitigate impermanent loss. Depending on the
              strategy, this may involve dynamic rebalancing, hedging, or concentration adjustments to optimize returns
              while minimizing IL.
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="cta-content">
          <h2>Ready to Optimize Your DeFi Strategy?</h2>
          <p>Join thousands of users who are already maximizing their returns with AIZen.</p>
          <div className="cta-buttons">
            <Link to="/marketplace" className="gradient-button">
              Explore Marketplace
            </Link>
            <Link to="/agent-builder" className="outline-button">
              Build Your Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default About

